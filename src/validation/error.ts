export type ValidationIssue = {
    message: string;
    path: string;
};

export class ValidationError extends Error {
    public readonly issues: ValidationIssue[];

    constructor(issues: ValidationIssue[]) {
        const message = issues.length === 1
            ? issues[0].message + (issues[0].path ? ` at path: ${issues[0].path}` : '')
            : `Validation failed with ${issues.length} error(s)`;

        super(message);
        this.name = 'ValidationError';
        this.issues = issues;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }

    withPath(segment: string | number): ValidationError {
        const updatedIssues = this.issues.map(issue => ({
            message: issue.message,
            path: this.buildPath(segment, issue.path)
        }));

        return new ValidationError(updatedIssues);
    }

    private formatSegment(segment: string | number): string {
        return typeof segment === 'number' ? `[${segment}]` : String(segment);
    }

    private getSeparator(path: string): string {
        return path.startsWith('[') ? '' : '.';
    }

    private buildPath(segment: string | number, existingPath: string): string {
        return !existingPath
            ? this.formatSegment(segment)
            : typeof segment === 'number'
                ? `[${segment}]${this.getSeparator(existingPath)}${existingPath}`
                : `${segment}${this.getSeparator(existingPath)}${existingPath}`;
    }
}

export function withPathContext<T>(
    segment: string | number,
    fn: () => T
): T {
    try {
        return fn();
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error.withPath(segment);
        }
        const pathSegment = typeof segment === 'number' ? `[${segment}]` : String(segment);
        throw new ValidationError([{
            message: error instanceof Error ? error.message : String(error),
            path: pathSegment
        }]);
    }
}
