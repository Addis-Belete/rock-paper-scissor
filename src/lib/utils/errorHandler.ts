export class ErrorHandler {
  private static maxAttempts = parseInt(
    process.env.RETRY_MAX_ATTEMPTS || "3",
    10
  );
  private static initialDelay = parseInt(
    process.env.RETRY_INITIAL_DELAY || "1000",
    10
  );
  private static errorDisplayTimeout = parseInt(
    process.env.ERROR_DISPLAY_TIMEOUT || "5000",
    10
  );

  /**
   * Retry wrapper with exponential backoff
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    retries = this.maxAttempts,
    delay = this.initialDelay
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 0) {
        this.logError(err);
        throw err;
      }

      console.warn(
        `Retrying after error: ${
          (err as Error).message
        } | Retries left: ${retries}`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.withRetry(fn, retries - 1, delay * 2); // exponential backoff
    }
  }

  /**
   * Log error for debugging or external monitoring
   */
  static logError(err: unknown) {
    if (err instanceof Error) {
      console.error(`[ErrorHandler] ${err.message}`);
    } else {
      console.error("[ErrorHandler] Unknown error", err);
    }
  }

  /**
   * Handle frontend error banner
   */
  static handleUserError(setIsError: (val: boolean) => void) {
    setIsError(true);
    setTimeout(() => setIsError(false), this.errorDisplayTimeout);
  }
}
