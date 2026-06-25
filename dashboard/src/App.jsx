import React, { useState, useEffect } from 'react';
import { isAllowed, setAllowed, requestAccess } from '@stellar/freighter-api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SendPaymentModal from './components/SendPaymentModal';
import CommandPalette from './components/CommandPalette';
import SettingsPanel from './components/SettingsPanel';
import Toast from './components/Toast';

import DashboardView from './views/DashboardView';
import TransferView from './views/TransferView';
import HistoryView from './views/HistoryView';

import { API_URLS } from './utils/constants';
import { generateMockId, getInitialMockTransactions, getInitialMockMetrics } from './services/mockData';

function App() {
  const [address, setAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };
  
  const [metrics, setMetrics] = useState({ balance: "0.00", totalTx: 0 });
  const [transactions, setTransactions] = useState([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [xlmPrice, setXlmPrice] = useState(null);
  
  const [network, setNetwork] = useState('Testnet');
  const [fiatCurrency, setFiatCurrency] = useState('usd');

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
        if (await isAllowed()) {
          const accessResponse = await requestAccess();
          const userAddress = typeof accessResponse === 'object' ? (accessResponse.address || accessResponse.publicKey || '') : accessResponse;
          if (userAddress) {
            setAddress(String(userAddress));
          }
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
      showToast("Failed to connect wallet. Please ensure Freighter is installed and unlocked.", "error");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendPayment = async ({ destination, amount }) => {
    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSendModalOpen(false);
      showToast(`Payment of ${amount} XLM sent successfully!`, "success");
      
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
      showToast("Payment failed. Please try again.", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-zinc-950">
      <div className="bg-grid"></div>
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-stellar-600/20 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'float-orb 20s infinite ease-in-out' }}></div>
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'float-orb 25s infinite ease-in-out reverse' }}></div>

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
        />

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === 'dashboard' && (
              <DashboardView 
                address={address}
                metrics={metrics}
                transactions={transactions}
                xlmPrice={xlmPrice}
                network={network}
                fiatCurrency={fiatCurrency}
                onOpenSendModal={() => setIsSendModalOpen(true)}
              />
            )}

            {activeTab === 'transfer' && (
              <TransferView 
                onOpenSendModal={() => setIsSendModalOpen(true)}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView 
                transactions={transactions}
                address={address}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPanel 
                network={network} 
                setNetwork={setNetwork} 
                fiatCurrency={fiatCurrency} 
                setFiatCurrency={setFiatCurrency} 
              />
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

      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        onSendPayment={() => {
          setIsCommandPaletteOpen(false);
          setIsSendModalOpen(true);
        }}
      />

      <Toast toast={toast} />
    </div>
  );
}

export default App;
