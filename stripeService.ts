
export const createCheckoutSession = async (priceId: string): Promise<{ url: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const mockSessionId = `cs_test_${Math.random().toString(36).substr(2, 9)}`;
  return {
    url: `${window.location.origin}/#/payment-success?session_id=${mockSessionId}`
  };
};

export const verifySession = async (sessionId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return (sessionId || '').startsWith('cs_test_');
};
