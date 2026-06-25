"use client";

import * as React from "react";

/**
 * Accessible modal dialog. Source uses Radix; we implement the minimum
 * surface (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`,
 * `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`) on
 * top of plain React state so the template baseline stays dep-free.
 *
 * Editor contract: dialog content tagged `data-nocms-component="dialog"`.
 * The title carries `data-role="heading"`, the description `data-role="subheading"`.
 */

type DialogContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog(): DialogContextValue {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("Dialog subcomponents must be used within a <Dialog />");
  return ctx;
}

interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const reactId = React.useId();
  const value = React.useMemo<DialogContextValue>(
    () => ({
      open,
      setOpen,
      titleId: `dialog-title-${reactId}`,
      descriptionId: `dialog-description-${reactId}`,
    }),
    [open, setOpen, reactId],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
};

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  asChild,
  children,
  onClick,
  ...props
}) => {
  const { setOpen } = useDialog();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) setOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    type ChildProps = { onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void };
    const child = children as React.ReactElement<ChildProps>;
    const childOnClick = child.props.onClick;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) setOpen(true);
      },
    });
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ID forwarded to `aria-describedby`. Defaults to the auto-generated description ID. */
  descriptionId?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  className = "",
  descriptionId,
  children,
  ...props
}) => {
  const { open, setOpen, titleId, descriptionId: ctxDescId } = useDialog();
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement as HTMLElement | null;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    contentRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousActive?.focus?.();
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-text/60 backdrop-blur-sm"
      />
      <div
        ref={contentRef}
        data-nocms-component="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId ?? ctxDescId}
        tabIndex={-1}
        className={`relative z-[101] w-full max-w-lg rounded-lg bg-background shadow-xl border border-text/5 p-6 mx-4 ${className}`}
        {...props}
      >
        {children}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close dialog"
          className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:text-text hover:bg-text/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className="sr-only">Close dialog</span>
        </button>
      </div>
    </div>
  );
};

export function DialogHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 flex flex-col gap-2 ${className}`} {...props} />;
}

export function DialogFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="group"
      aria-label="Dialog actions"
      className={`mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 ${className}`}
      {...props}
    />
  );
}

export function DialogTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialog();
  return (
    <h2
      id={titleId}
      data-role="heading"
      className={`font-heading text-xl font-bold text-text ${className}`}
      {...props}
    />
  );
}

export function DialogDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useDialog();
  return (
    <p
      id={descriptionId}
      data-role="subheading"
      className={`text-sm text-muted ${className}`}
      {...props}
    />
  );
}

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogClose: React.FC<DialogCloseProps> = ({
  asChild,
  children,
  onClick,
  ...props
}) => {
  const { setOpen } = useDialog();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) setOpen(false);
  };
  if (asChild && React.isValidElement(children)) {
    type ChildProps = { onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void };
    const child = children as React.ReactElement<ChildProps>;
    const childOnClick = child.props.onClick;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) setOpen(false);
      },
    });
  }
  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
};
