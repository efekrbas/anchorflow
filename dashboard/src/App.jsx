import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isAllowed, setAllowed, requestAccess } from '@stellar/freighter-api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SendPaymentModal from './components/SendPaymentModal';
import CommandPalette from './components/CommandPalette';
import SettingsPanel from './components/SettingsPanel';
import LoadingScreen from './components/LoadingScreen';
import { Toaster, toast } from 'sonner';

import DashboardView from './views/DashboardView';
import TransferView from './views/TransferView';
import HistoryView from './views/HistoryView';

import { API_URLS } from './utils/constants';
import { generateMockId, getInitialMockTransactions, getInitialMockMetrics } from './services/mockData';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [address, setAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState({ balance: "0.00", totalTx: 0 });
  const [transactions, setTransactions] = useState([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [xlmPrice, setXlmPrice] = useState(null);
  
  const [network, setNetwork] = useState('Testnet');
  const [fiatCurrency, setFiatCurrency] = useState('usd');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`${API_URLS.COINGECKO_STELLAR_PRICE}${fiatCurrency}`);
        const data = await res.json();
        if (data && data.stellar) {
          setXlmPrice(data.stellar[fiatCurrency]);
        }
      } catch (e) {
        console.error("Failed to fetch XLM price");
      }
    };
    fetchPrice();
  }, [fiatCurrency]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const titles = {
      dashboard: 'Dashboard',
      transfer: 'Transfer',
      history: 'Transaction History',
      settings: 'Settings'
    };
    document.title = `AnchorFlow — ${titles[activeTab] || 'Dashboard'}`;
  }, [activeTab]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Only check if user allowed the app previously, but don't prompt with requestAccess to avoid popup on load.
        const allowed = await isAllowed();
        if (allowed) {
          // You can handle silent re-connection here if Freighter supports it,
          // but calling requestAccess() will trigger a prompt if locked.
        }
      } catch (e) {
        console.error("Freighter connection check failed:", e);
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (!address) return;
    
    if (network === 'Mainnet') {
      setMetrics({ balance: "0.00", totalTx: 0 });
      setTransactions([]);
    } else if (network === 'Futurenet') {
      setMetrics({ balance: "5,000.00", totalTx: 3 });
      setTransactions([]);
    } else {
      setMetrics(getInitialMockMetrics());
      setTransactions(getInitialMockTransactions(address));
    }
  }, [network, address]);

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
    } catch (e) {
      console.error("Failed to connect Freighter:", e);
      toast.error("Failed to connect wallet. Please ensure Freighter is installed and unlocked.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendPayment = async ({ destination, amount }) => {
    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSendModalOpen(false);
      toast.success(`Payment of ${amount} XLM sent successfully!`);
      
      const newTx = {
        id: generateMockId(),
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
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen relative overflow-hidden" style={{ background: '#060a14' }}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">Skip to main content</a>
      {/* Grid background */}
      <div className="bg-grid"></div>
      
      {/* Ambient orbs */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none" 
        style={{ 
          top: '15%', 
          left: '5%', 
          background: 'radial-gradient(circle, rgba(51,129,255,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float-orb 20s infinite ease-in-out' 
        }}
      ></div>
      <div 
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" 
        style={{ 
          bottom: '5%', 
          right: '0%', 
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float-orb-reverse 25s infinite ease-in-out' 
        }}
      ></div>
      <div 
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" 
        style={{ 
          top: '60%', 
          left: '40%', 
          background: 'radial-gradient(circle, rgba(51,129,255,0.05) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'float-orb 30s infinite ease-in-out' 
        }}
      ></div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        logoSrc="/logo.jpg"
      />

      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        <Header 
          address={address} 
          isConnecting={isConnecting} 
          onConnect={handleConnect} 
          onDisconnect={handleDisconnect}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          network={network}
        />

        <div id="main-content" className="flex-1 p-6 md:p-8 overflow-y-auto" tabIndex="-1">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                {activeTab === 'dashboard' && (
                  <DashboardView 
                    address={address}
                    metrics={metrics}
                    transactions={transactions}
                    xlmPrice={xlmPrice}
                    network={network}
                    fiatCurrency={fiatCurrency}
                    onOpenSendModal={() => setIsSendModalOpen(true)}
                    onViewAll={() => setActiveTab('history')}
                  />
                )}

                {activeTab === 'transfer' && (
                  <TransferView 
                    address={address}
                    onOpenSendModal={() => setIsSendModalOpen(true)}
                  />
                )}

                {activeTab === 'history' && (
                  <HistoryView 
                    transactions={transactions}
                    address={address}
                    onOpenSendModal={() => setIsSendModalOpen(true)}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsPanel 
                    address={address}
                    network={network} 
                    setNetwork={setNetwork} 
                    fiatCurrency={fiatCurrency} 
                    setFiatCurrency={setFiatCurrency} 
                  />
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </main>

      <SendPaymentModal 
        isOpen={isSendModalOpen} 
        onClose={() => setIsSendModalOpen(false)} 
        onSend={handleSendPayment}
        isSending={isSending}
      />

      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        onSendPayment={() => {
          setIsCommandPaletteOpen(false);
          setIsSendModalOpen(true);
        }}
      />

      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}

export default App;
