import React, { useState, useEffect } from 'react';
import { isAllowed, setAllowed, requestAccess } from '@stellar/freighter-api';
import clsx from 'clsx';
import { Wallet, Activity, ArrowRightLeft, ShieldCheck, Send } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import TransactionTable from './components/TransactionTable';
import SendPaymentModal from './components/SendPaymentModal';

function App() {
  const [address, setAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock data for now, ideally fetched from Soroban/backend
  const [metrics, setMetrics] = useState({
    balance: "0.00",
    totalTx: 0,
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Check if Freighter is already connected
    const checkConnection = async () => {
      try {
        if (await isAllowed()) {
          const accessResponse = await requestAccess();
          const userAddress = typeof accessResponse === 'object' ? (accessResponse.address || accessResponse.publicKey || '') : accessResponse;
          if (userAddress) {
            setAddress(String(userAddress));
            // Fetch real data here
            setMetrics({ balance: "1,250.50", totalTx: 12 });
            setTransactions([
              { id: '1', from: String(userAddress), to: 'GDXX...A1B2', amount: 50, created_at: new Date().toISOString(), status: 'success' },
              { id: '2', from: 'GAYY...99Z1', to: String(userAddress), amount: 200, created_at: new Date(Date.now() - 86400000).toISOString(), status: 'success' },
            ]);
          }
        }
      } catch (e) {
        console.error("Freighter connection check failed:", e);
      }
    };
    checkConnection();
  }, []);

  const handleDisconnect = () => {
    setAddress(null);
    setMetrics({ balance: "0.00", totalTx: 0 });
    setTransactions([]);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await setAllowed();
      const accessResponse = await requestAccess();
      const userAddress = typeof accessResponse === 'object' ? (accessResponse.address || accessResponse.publicKey || '') : accessResponse;
      setAddress(String(userAddress));
      
      // Fetch data
      setMetrics({ balance: "1,250.50", totalTx: 12 });
      setTransactions([
        { id: '1', from: String(userAddress), to: 'GDXX...A1B2', amount: 50, created_at: new Date().toISOString(), status: 'success' },
        { id: '2', from: 'GAYY...99Z1', to: String(userAddress), amount: 200, created_at: new Date(Date.now() - 86400000).toISOString(), status: 'success' },
      ]);
    } catch (e) {
      console.error("Failed to connect Freighter:", e);
      alert("Failed to connect wallet. Please ensure Freighter is installed and unlocked.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendPayment = async ({ destination, amount }) => {
    setIsSending(true);
    try {
      // Soroban Smart Contract invocation logic would go here
      // const tx = await invokeSorobanContract(destination, amount);
      console.log(`Sending ${amount} XLM to ${destination}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSendModalOpen(false);
      alert('Payment sent successfully! (Simulated)');
      
      // Update local state
      const newTx = {
        id: Math.random().toString(36).substr(2, 9),
        from: address,
        to: destination,
        amount: parseFloat(amount),
        created_at: new Date().toISOString(),
        status: 'success'
      };
      setTransactions(prev => [newTx, ...prev]);
      setMetrics(prev => ({
        ...prev,
        balance: (parseFloat(prev.balance.replace(/,/g, '')) - parseFloat(amount)).toLocaleString('en-US', { minimumFractionDigits: 2 }),
        totalTx: prev.totalTx + 1
      }));
    } catch (e) {
      console.error("Payment failed:", e);
      alert("Payment failed.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-zinc-950">
      {/* Background elements */}
      <div className="bg-grid"></div>
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-stellar-600/20 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'float-orb 20s infinite ease-in-out' }}></div>
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'float-orb 25s infinite ease-in-out reverse' }}></div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        <Header 
          address={address} 
          isConnecting={isConnecting} 
          onConnect={handleConnect} 
          onDisconnect={handleDisconnect}
        />

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === 'dashboard' && (
              <>
                {/* Quick Actions & Welcome */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up">
                  <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                      Dashboard
                    </h2>
                    <p className="text-zinc-400 mt-1">
                      Manage your AnchorFlow smart contract remittances.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSendModalOpen(true)}
                    disabled={!address}
                    className={clsx(
                      "btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all",
                      !address ? "opacity-50 cursor-not-allowed bg-zinc-800" : "bg-stellar-600 hover:bg-stellar-500 hover:shadow-[0_0_20px_rgba(51,129,255,0.4)] hover:-translate-y-0.5"
                    )}
                  >
                    <Send className="w-4 h-4" />
                    Send Payment
                  </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard 
                    title="Total Balance" 
                    value={address ? `${metrics.balance} XLM` : '---'} 
                    icon={Wallet}
                    delayClass="animate-slide-up"
                    style={{ animationDelay: '100ms' }}
                  />
                  <MetricCard 
                    title="Transactions" 
                    value={address ? metrics.totalTx : '---'} 
                    icon={ArrowRightLeft}
                    trend="+2 this week"
                    delayClass="animate-slide-up"
                    style={{ animationDelay: '200ms' }}
                  />
                  <MetricCard 
                    title="Network Status" 
                    value="Testnet" 
                    icon={Activity}
                    delayClass="animate-slide-up"
                    style={{ animationDelay: '300ms' }}
                  />
                  <MetricCard 
                    title="Contract Status" 
                    value="Active" 
                    icon={ShieldCheck}
                    delayClass="animate-slide-up"
                    style={{ animationDelay: '400ms' }}
                  />
                </div>

                {/* Transactions Table */}
                <TransactionTable transactions={transactions} address={address} />
              </>
            )}

            {activeTab === 'transfer' && (
              <div className="animate-fade-in max-w-2xl mx-auto mt-8">
                <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-stellar-500/20 flex items-center justify-center border border-stellar-500/30">
                      <Send className="w-7 h-7 text-stellar-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Direct Transfer</h2>
                      <p className="text-zinc-400 text-sm mt-1">Send funds securely to any stellar address.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSendModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all shadow-lg bg-stellar-600 hover:bg-stellar-500 hover:-translate-y-1 btn-primary"
                  >
                    Open Transfer Modal <Send className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Transaction History</h2>
                  <p className="text-zinc-400 mt-1">View all your past activities and transfers.</p>
                </div>
                <TransactionTable transactions={transactions} address={address} />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                 <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
                  <p className="text-zinc-400 mt-1">Manage your account and preferences.</p>
                </div>
                <div className="glass-card rounded-2xl p-8 border border-white/10 text-center py-20">
                  <ShieldCheck className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white">Settings panel coming soon!</h3>
                  <p className="text-zinc-400 mt-2">More configurations will be added here in the future.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <SendPaymentModal 
        isOpen={isSendModalOpen} 
        onClose={() => setIsSendModalOpen(false)} 
        onSend={handleSendPayment}
        isSending={isSending}
      />
    </div>
  );
}

export default App;
