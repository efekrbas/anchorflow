export const generateMockId = () => {
  return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

const generateMockAddress = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  return 'G' + Array.from({length: 55}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};
export const getInitialMockTransactions = (userAddress) => {
  const transactions = [];
  const now = Date.now();
  
  for (let i = 0; i < 12; i++) {
    const isSend = Math.random() > 0.5;
    const amount = Math.floor(Math.random() * 500) + 10;
    const timeOffset = Math.floor(Math.random() * 86400000 * 7); // within last 7 days
    
    transactions.push({
      id: generateMockId(),
      from: isSend ? String(userAddress) : generateMockAddress(),
      to: isSend ? generateMockAddress() : String(userAddress),
      amount: amount.toFixed(2),
      created_at: new Date(now - timeOffset).toISOString(),
      status: Math.random() > 0.1 ? 'success' : (Math.random() > 0.5 ? 'pending' : 'failed')
    });
  }
  
  return transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getInitialMockMetrics = () => ({
  balance: "1,250.50",
  totalTx: 12
});
