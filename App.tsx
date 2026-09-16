import React, { useState } from 'react';
import { LocalizationProvider, useLocalization } from './context/LocalizationContext';
import { LocalizationBanner } from './components/LocalizationBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CentreBoard } from './components/CentreBoard';
import { ProblemSection } from './components/ProblemSection';
import { PillarsSection } from './components/PillarsSection';
import { SmsIvrSection } from './components/SmsIvrSection';
import { OfficerDashboard } from './components/OfficerDashboard';
import { FarmerAppModal } from './components/FarmerAppModal';
import { Footer } from './components/Footer';
import { Booking, WaitlistItem, SmsMessage } from './types';
import { X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { t, lang, speakText, voiceAssistEnabled } = useLocalization();

  // App Simulation State
  const [activePersona, setActivePersona] = useState<'ravi' | 'suresh'>('ravi');
  const [slot1030Capacity, setSlot1030Capacity] = useState<number>(1);
  const [heroPos] = useState<number>(4);
  const [isFarmerAppOpen, setIsFarmerAppOpen] = useState<boolean>(false);
  const [farmerAppScreen, setFarmerAppScreen] = useState<number>(0);
  const [delayNotice, setDelayNotice] = useState<string>('');

  // Toast Notification state
  const [toast, setToast] = useState<{
    show: boolean;
    sender: string;
    text: string;
    type: 'normal' | 'waitlist' | 'promoted';
  }>({
    show: false,
    sender: 'SMS · AGRQUE',
    text: '',
    type: 'normal'
  });

  const showNotification = (text: string, sender: string = 'SMS · AGRQUE', type: 'normal' | 'waitlist' | 'promoted' = 'normal') => {
    setToast({
      show: true,
      sender,
      text,
      type
    });

    // Add to SMS Simulation Feed
    const now = new Date();
    const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    
    setSmsMessages(prev => [
      {
        id: `sms-${Date.now()}`,
        sender,
        time: timeStr,
        text,
        type
      },
      ...prev
    ]);

    if (voiceAssistEnabled) {
      speakText(text);
    }

    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 6500);
  };

  // Initial Bookings in system
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'KRM-0338',
      name: 'Lakshmi Devi',
      slot: '9:30–10:30',
      status: 'On weighbridge',
      type: 'confirmed',
      gateClass: 'g',
      crop: 'Paddy Grade A',
      mobile: '9849011223',
      staggeredWindow: '9:15–9:30 AM'
    },
    {
      id: 'KRM-0339',
      name: 'Srinivas Reddy',
      slot: '10:30–11:30',
      status: 'At Gate 2',
      type: 'confirmed',
      gateClass: 'g',
      crop: 'Paddy Grade A',
      mobile: '9849033445',
      staggeredWindow: '10:15–10:30 AM'
    },
    {
      id: 'KRM-0340',
      name: 'Anjaiah',
      slot: '10:30–11:30',
      status: 'En route',
      type: 'confirmed',
      gateClass: 'y',
      crop: 'Paddy Common',
      mobile: '9849055667',
      staggeredWindow: '10:30–10:45 AM'
    },
    {
      id: 'KRM-0341',
      name: 'Padma Rao',
      slot: '10:30–11:30',
      status: 'No-show (18 min overdue)',
      type: 'no-show',
      gateClass: 'r',
      crop: 'Paddy Grade A',
      mobile: '9849077889',
      staggeredWindow: '10:00–10:15 AM'
    }
  ]);

  // Initial Waiting List
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([
    {
      wlId: 'WL-01',
      name: 'Suresh Reddy',
      mobile: '9849099882',
      slot: '10:30–11:30',
      crop: 'Paddy Grade A (35 qtl)',
      priority: 1,
      timestamp: '09:12 AM'
    }
  ]);

  // Initial SMS Feed
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>([
    {
      id: 'sms-1',
      sender: 'AGRQUE',
      time: '06:14 AM',
      text: 'Slot confirmed. Token KRM-0342, Karimnagar Gate 2, 10:30-11:30. Staggered gate arrival: 10:15-10:30 AM ONLY. Do not arrive early.',
      type: 'normal'
    },
    {
      id: 'sms-2',
      sender: 'AGRQUE',
      time: '09:12 AM',
      text: '[WAITLIST NOTICE] Slot 10:30-11:30 is FULL. Assigned WAITING LIST (WL-01). STRICT ADVISORY: Do NOT travel to mandi to avoid highway queues. You will be notified if a spot opens.',
      type: 'waitlist'
    }
  ]);

  // Booking a slot from the farmer app
  const handleBookSlot = (slot: string, qty: string) => {
    if (slot === '10:30–11:30') {
      if (slot1030Capacity > 0) {
        // Slot is available! Farmer gets confirmed token
        setSlot1030Capacity(0);
        setFarmerAppScreen(4);

        const newBooking: Booking = {
          id: 'KRM-0342',
          name: activePersona === 'ravi' ? 'Ravi Kumar' : 'Suresh Reddy',
          slot: '10:30–11:30',
          status: 'Gate Pass Active',
          type: 'confirmed',
          gateClass: 'g',
          crop: `Paddy (${qty} qtl)`,
          mobile: activePersona === 'ravi' ? '9849023411' : '9849099882',
          staggeredWindow: '10:15–10:30 AM'
        };

        setBookings(prev => [...prev, newBooking]);
        showNotification(t.toastBookRavi, 'SMS · GATE PASS', 'normal');
      } else {
        // Slot is full! Farmer is placed on automated waiting list
        setFarmerAppScreen(4.5);

        const newWaitlistItem: WaitlistItem = {
          wlId: `WL-0${waitlist.length + 1}`,
          name: activePersona === 'ravi' ? 'Ravi Kumar' : 'Suresh Reddy',
          mobile: activePersona === 'ravi' ? '9849023411' : '9849099882',
          slot: '10:30–11:30',
          crop: `Paddy (${qty} qtl)`,
          priority: waitlist.length + 1,
          timestamp: 'Just now'
        };

        setWaitlist(prev => [...prev, newWaitlistItem]);
        showNotification(t.toastWaitlistSuresh, 'SMS · WAITING LIST', 'waitlist');
      }
    } else {
      setFarmerAppScreen(4);
      showNotification(`Slot ${slot} confirmed! Gate pass window: 15-min staggered.`, 'SMS · GATE PASS', 'normal');
    }
  };

  // Officer releases no-show slot & automatically promotes waitlist #1
  const handlePromoteWaitlist = () => {
    if (waitlist.length === 0) {
      setDelayNotice('Waiting list is currently empty. All registered farmers have confirmed slots.');
      return;
    }

    const nextFarmer = waitlist[0];
    const remainingWaitlist = waitlist.slice(1);
    setWaitlist(remainingWaitlist);

    // Update overdue booking
    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.type === 'no-show') {
          return { ...b, status: 'Slot Released (Overdue)', gateClass: 'y' as const };
        }
        return b;
      });

      // Add promoted farmer
      return [
        ...updated,
        {
          id: 'KRM-0344',
          name: nextFarmer.name,
          slot: '10:30–11:30',
          status: 'Promoted · Window 11:00 AM',
          type: 'promoted',
          gateClass: 'g',
          crop: nextFarmer.crop,
          mobile: nextFarmer.mobile,
          staggeredWindow: '11:00–11:15 AM'
        }
      ];
    });

    setDelayNotice(`Action Successful: Released abandoned spot. ${nextFarmer.name} (${nextFarmer.wlId}) auto-promoted to Token KRM-0344 with staggered gate pass at 11:00 AM.`);
    showNotification(t.toastPromote, 'SMS · KARIMNAGAR PPC', 'promoted');

    // If farmer app is currently showing waitlist, upgrade to confirmed token!
    if (farmerAppScreen === 4.5) {
      setFarmerAppScreen(4);
    }
  };

  const handleWeatherDelay = () => {
    setDelayNotice('Weather advisory broadcasted: Remaining time bands pushed +30 mins. SMS & toll-free IVR notifications dispatched.');
    showNotification('Procurement delay notice: All afternoon slots pushed +30 mins due to weather.', 'SMS · ADVISORY');
  };

  const handleAdvanceWeighment = () => {
    setFarmerAppScreen(5);
    showNotification(t.toastWeighmentFinished, 'SMS · PFMS DBT');
  };

  const handleRestartDemo = () => {
    setSlot1030Capacity(1);
    setActivePersona('ravi');
    setFarmerAppScreen(0);
    setDelayNotice('');
    showNotification('System demo simulation reset to initial conditions.', 'SYSTEM');
  };

  // Two-Farmer Contention Automated Test
  const handleRunTwoFarmerTest = () => {
    setIsFarmerAppOpen(true);
    setActivePersona('ravi');
    setFarmerAppScreen(3);
    showNotification('Test Step 1: Farmer 1 (Ravi) selecting last opening for 10:30–11:30...', 'INTERNAL SIM');

    setTimeout(() => {
      handleBookSlot('10:30–11:30', '42.5');

      setTimeout(() => {
        showNotification('Test Step 2: Switching to Farmer 2 (Suresh) attempting same slot...', 'INTERNAL SIM');
        setActivePersona('suresh');
        setFarmerAppScreen(3);

        setTimeout(() => {
          handleBookSlot('10:30–11:30', '35.0');
        }, 1800);

      }, 2500);

    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f1f4ee] text-[#12241a] font-sans antialiased selection:bg-[#e7b32b] selection:text-[#3a2a00]">
      {/* Dynamic Localization & Auto-detect bar */}
      <LocalizationBanner />

      {/* Main Sticky Navbar */}
      <Navbar onOpenFarmerApp={() => setIsFarmerAppOpen(true)} />

      {/* Hero Section */}
      <HeroSection
        onOpenFarmerApp={() => setIsFarmerAppOpen(true)}
        heroPos={heroPos}
      />

      {/* Live Centre Board */}
      <CentreBoard
        slot1030Capacity={slot1030Capacity}
        waitlistLength={waitlist.length}
      />

      {/* The Problem Section */}
      <ProblemSection />

      {/* 5 Pillars Section */}
      <PillarsSection />

      {/* SMS Simulation & Interactive IVR Section */}
      <SmsIvrSection smsMessages={smsMessages} />

      {/* Officer Dashboard Section */}
      <OfficerDashboard
        bookings={bookings}
        waitlist={waitlist}
        onPromoteWaitlist={handlePromoteWaitlist}
        onWeatherDelay={handleWeatherDelay}
        delayNotice={delayNotice}
      />

      {/* Footer */}
      <Footer onOpenFarmerApp={() => setIsFarmerAppOpen(true)} />

      {/* Interactive Farmer App Simulation Modal */}
      <FarmerAppModal
        isOpen={isFarmerAppOpen}
        onClose={() => setIsFarmerAppOpen(false)}
        activePersona={activePersona}
        setActivePersona={setActivePersona}
        slot1030Capacity={slot1030Capacity}
        onBookSlot={handleBookSlot}
        onAdvanceWeighment={handleAdvanceWeighment}
        onPromoteWaitlistNow={handlePromoteWaitlist}
        onRestartDemo={handleRestartDemo}
        onRunTwoFarmerTest={handleRunTwoFarmerTest}
        currentScreen={farmerAppScreen}
        setCurrentScreen={setFarmerAppScreen}
      />

      {/* Floating Real-Time Toast Notification */}
      {toast.show && (
        <div
          id="global-toast-notification"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#12241a] text-white p-4 rounded-xl shadow-2xl border-l-4 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200"
          style={{
            borderLeftColor:
              toast.type === 'waitlist'
                ? '#e7b32b'
                : toast.type === 'promoted'
                ? '#2fbf6b'
                : '#4fd98a'
          }}
        >
          <div className="flex-1 space-y-1">
            <span className="block text-[10px] font-bold text-[#e7b32b] uppercase tracking-wider">
              {toast.sender}
            </span>
            <p className="text-xs text-[#eef3ec] leading-relaxed">
              {toast.text}
            </p>
          </div>
          <button
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <LocalizationProvider>
      <MainAppContent />
    </LocalizationProvider>
  );
}
