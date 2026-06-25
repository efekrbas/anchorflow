export const generateMockId = () => Math.random().toString(36).substr(2, 9);

export const getInitialMockTransactions = (userAddress) => [
  { 
    id: generateMockId(), 
    from: String(userAddress), 
    to: 'GDXX...A1B2', 
    amount: 50, 
    created_at: new Date().toISOString(), 
    status: 'success' 
  },
  { 
    id: generateMockId(), 
    from: 'GAYY...99Z1', 
    to: String(userAddress), 
    amount: 200, 
    created_at: new Date(Date.now() - 86400000).toISOString(), 
    status: 'success' 
  },
];

export const getInitialMockMetrics = () => ({
  balance: "1,250.50",
  totalTx: 12
});
