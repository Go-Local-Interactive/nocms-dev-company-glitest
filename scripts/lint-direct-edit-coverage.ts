#!/usr/bin/env bun
/**
 * Direct-edit coverage lint.
 *
 * Walks `src/components/**\/*.tsx` and reports `data-role`'d elements whose
 * direct-edit pipeline cannot resolve to a string literal:
 *   - JSX child is a template expression / no-substitution template literal.
 *   - JSX child is a `{prop}` identifier whose call site (in `src/app/**\/*.tsx`)
 *     passes a non-literal expression (variable, template, etc).
 *
 * Always exits 0 — informational only. Template repos can wire this into CI as
 * a blocking check on their own schedule.
 *
 * Self-contained — must run in template repos that don't have `@/lib/patcher/*`.
 *
 * Usage: `bun run scripts/lint-direct-edit-coverage.ts [workspacePath]`
 */
import {
  Node,
  Project,
  SyntaxKind,
  type JsxAttribute,
  type SourceFile,
} from "ts-morph";
import path from "node:path";
import { readdirSync, statSync } from "node:fs";

export interface LintFinding {
  file: string;
  line: number;
  role: string;
  reason: string;
}

export function lintDirectEditCoverage(workspacePath: string): LintFinding[] {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const findings: LintFinding[] = [];

  const componentFiles = collectTsxFilesSync(workspacePath, "src/components");
  const pageFiles = collectTsxFilesSync(workspacePath, "src/app");
  for (const rel of [...componentFiles, ...pageFiles]) {
    project.addSourceFileAtPath(path.join(workspacePath, rel));
  }

  for (const file of project.getSourceFiles()) {
    const rel = toPosix(path.relative(workspacePath, file.getFilePath()));
    if (!rel.startsWith("src/components/")) continue;

    file.forEachDescendant((node) => {
      if (!Node.isJsxOpeningElement(node) && !Node.isJsxSelfClosingElement(node)) return;

      const roleAttr = node.getAttribute("data-role");
      if (!roleAttr || roleAttr.getKind() !== SyntaxKind.JsxAttribute) return;
      const roleInit = (roleAttr as JsxAttribute).getInitializer();
      if (!roleInit || !Node.isStringLiteral(roleInit)) return;
      const role = roleInit.getLiteralText();

      const parent = node.getParent();
      if (!Node.isJsxElement(parent)) return;
      const children = parent.getJsxChildren().filter((c) => {
        if (Node.isJsxText(c)) return c.getText().trim().length > 0;
        return true;
      });
      if (children.length !== 1) return;

      const child = children[0];
      if (Node.isJsxText(child)) return;

      if (!Node.isJsxExpression(child)) return;
      const expr = child.getExpression();
      if (!expr) return;

      if (
        Node.isTemplateExpression(expr) ||
        Node.isNoSubstitutionTemplateLiteral(expr)
      ) {
        findings.push({
          file: rel,
          line: child.getStartLineNumber(),
          role,
          reason:
            'bound to a template expression. Use a plain string prop or hardcode the text.',
        });
        return;
      }

      if (Node.isIdentifier(expr)) {
        const propName = expr.getText();
        const componentName = findExportedComponentName(file);
        if (!componentName) return;
        if (!isFunctionParam(file, componentName, propName)) return;

        const callSiteIssue = findNonLiteralCallSite(
          project,
          workspacePath,
          componentName,
          propName,
        );
        if (callSiteIssue) {
          findings.push({
            file: rel,
            line: child.getStartLineNumber(),
            role,
            reason: `prop "${propName}" bound to a non-literal expression at ${callSiteIssue}. Edit the source variable directly or pass a string literal.`,
          });
        }
      }
    });
  }

  return findings;
}

function toPosix(p: string): string {
  return p.split(path.sep).join("/");
}

function collectTsxFilesSync(workspacePath: string, subdir: string): string[] {
  const root = path.join(workspacePath, subdir);
  const out: string[] = [];
  function walk(dir: string): void {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      const full = path.join(dir, name);
      let s;
      try {
        s = statSync(full);
      } catch {
        continue;
      }
      if (s.isDirectory()) {
        walk(full);
      } else if (s.isFile() && name.endsWith(".tsx")) {
        out.push(path.relative(workspacePath, full));
      }
    }
  }
  walk(root);
  return out;
}

function findExportedComponentName(file: SourceFile): string | null {
  for (const fn of file.getFunctions()) {
    if (!fn.isExported() && !fn.isDefaultExport()) continue;
    const name = fn.getName();
    if (name && /^[A-Z]/.test(name)) return name;
  }
  for (const v of file.getVariableDeclarations()) {
    const name = v.getName();
    if (!/^[A-Z]/.test(name)) continue;
    const init = v.getInitializer();
    if (!init) continue;
    if (Node.isArrowFunction(init) || Node.isFunctionExpression(init)) return name;
  }
  return null;
}

function isFunctionParam(
  file: SourceFile,
  componentName: string,
  propName: string,
): boolean {
  for (const fn of file.getFunctions()) {
    if (fn.getName() !== componentName) continue;
    const params = fn.getParameters();
    if (params.length === 0) return false;
    const binding = params[0].getNameNode();
    if (!Node.isObjectBindingPattern(binding)) return false;
    for (const el of binding.getElements()) {
      const n = el.getPropertyNameNode();
      const name = n ? n.getText() : el.getNameNode().getText();
      if (name === propName) return true;
    }
    return false;
  }
  return false;
}

function findNonLiteralCallSite(
  project: Project,
  workspacePath: string,
  componentName: string,
  propName: string,
): string | null {
  for (const file of project.getSourceFiles()) {
    const rel = toPosix(path.relative(workspacePath, file.getFilePath()));
    if (!rel.startsWith("src/app/")) continue;

    let issue: string | null = null;
    file.forEachDescendant((node, traversal) => {
      if (issue) {
        traversal.stop();
        return;
      }
      if (!Node.isJsxOpeningElement(node) && !Node.isJsxSelfClosingElement(node)) return;
      if (node.getTagNameNode().getText() !== componentName) return;

      const attr = node.getAttribute(propName);
      if (!attr || attr.getKind() !== SyntaxKind.JsxAttribute) return;
      const init = (attr as JsxAttribute).getInitializer();
      if (!init) return;
      if (Node.isStringLiteral(init)) return;
      if (Node.isJsxExpression(init)) {
        const expr = init.getExpression();
        if (!expr) return;
        if (Node.isStringLiteral(expr)) return;
        issue = `${rel}:${init.getStartLineNumber()}`;
      }
    });
    if (issue) return issue;
  }
  return null;
}

async function main(): Promise<void> {
  const workspacePath = process.argv[2]
    ? path.resolve(process.argv[2])
    : process.cwd();
  const findings = lintDirectEditCoverage(workspacePath);
  if (findings.length === 0) {
    console.log("ok no direct-edit coverage issues found");
    return;
  }
  for (const f of findings) {
    console.log(
      `${f.file}:${f.line} [warning] data-role="${f.role}" element ${f.reason}`,
    );
  }
}

if (import.meta.main) {
  await main();
}
