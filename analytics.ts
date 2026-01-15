
/**
 * Simple Analytics Wrapper (Mocking Posthog)
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] Tracked: ${eventName}`, properties);
  // In production, you would call posthog.capture(eventName, properties) here.
};

export const ANALYTICS_EVENTS = {
  SUMMARIZE_CLICKED: 'summarize_clicked',
  SIGNUP_VIEWED: 'signup_viewed',
  SHARE_CLICKED: 'share_clicked',
  SUMMARY_RATED: 'summary_rated',
  UPGRADE_MODAL_VIEWED: 'upgrade_modal_viewed',
};
