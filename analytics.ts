
export const ANALYTICS_EVENTS = {
  SIGNUP_VIEWED: 'signup_viewed',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN_VIEWED: 'login_viewed',
  SUMMARIZE_CLICKED: 'summarize_clicked',
  SUMMARIZE_COMPLETED: 'summarize_completed',
  SUMMARIZE_FAILED: 'summarize_failed',
  SHARE_CLICKED: 'share_clicked',
  SUMMARY_RATED: 'summary_rated',
  UPGRADE_MODAL_VIEWED: 'upgrade_modal_viewed',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed'
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] ${eventName}`, {
    ...properties,
    timestamp: new Date().toISOString()
  });
};

export const trackError = (error: Error, context?: string) => {
  console.error(`[Analytics Error] ${context}:`, error);
  trackEvent('error_occurred', { message: error.message, context });
};
