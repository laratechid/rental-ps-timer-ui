import React, { useState, useRef } from 'react';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSound from 'use-sound';
import notificationSound from "../src/sound/notification.mp3";

type Unit = '41' | '42' | '31' | '32' | '33';

interface PriceTier {
  hours: number;
  minutes: number;
  price: number;
}

interface TimerState {
  isRunning: boolean;
  startTime: moment.Moment | null;
  endTime: moment.Moment | null;
  displayTime: string;
  currentPrice: number;
  isCountdown: boolean;
  durationHours?: number;
  selectedDuration?: number;
  note: string;
  fixedDuration?: string;
}

interface CanteenItem {
  name: string;
  price: number;
}

const PRICE_TIERS: Record<Unit, PriceTier[]> = {
  '41': [
    { hours: 0, minutes: 0, price: 8000 },
    { hours: 1, minutes: 0, price: 8000 },
    { hours: 1, minutes: 10, price: 10000 },
    { hours: 1, minutes: 20, price: 12000 },
    { hours: 1, minutes: 30, price: 13000 },
    { hours: 1, minutes: 40, price: 15000 },
    { hours: 1, minutes: 50, price: 16000 },
    { hours: 2, minutes: 0, price: 16000 },
    { hours: 2, minutes: 10, price: 18000 },
    { hours: 2, minutes: 20, price: 20000 },
    { hours: 2, minutes: 30, price: 21000 },
    { hours: 2, minutes: 40, price: 23000 },
    { hours: 2, minutes: 50, price: 24000 },
    { hours: 3, minutes: 0, price: 20000 },
    { hours: 3, minutes: 10, price: 22000 },
    { hours: 3, minutes: 20, price: 24000 },
    { hours: 3, minutes: 30, price: 25000 },
    { hours: 3, minutes: 40, price: 26000 },
    { hours: 3, minutes: 50, price: 28000 },
    { hours: 4, minutes: 0, price: 28000 },
    { hours: 4, minutes: 10, price: 30000 },
    { hours: 4, minutes: 20, price: 32000 },
    { hours: 4, minutes: 30, price: 34000 },
    { hours: 4, minutes: 40, price: 35000 },
    { hours: 4, minutes: 50, price: 36000 },
    { hours: 5, minutes: 0, price: 36000 },
    { hours: 5, minutes: 10, price: 38000 },
    { hours: 5, minutes: 20, price: 39000 },
    { hours: 5, minutes: 30, price: 40000 },
    { hours: 5, minutes: 40, price: 41000 },
    { hours: 5, minutes: 50, price: 43000 },
    { hours: 6, minutes: 0, price: 40000 }
  ],
  '42': [
    { hours: 0, minutes: 0, price: 8000 },
    { hours: 1, minutes: 0, price: 8000 },
    { hours: 1, minutes: 10, price: 10000 },
    { hours: 1, minutes: 20, price: 12000 },
    { hours: 1, minutes: 30, price: 13000 },
    { hours: 1, minutes: 40, price: 15000 },
    { hours: 1, minutes: 50, price: 16000 },
    { hours: 2, minutes: 0, price: 16000 },
    { hours: 2, minutes: 10, price: 18000 },
    { hours: 2, minutes: 20, price: 20000 },
    { hours: 2, minutes: 30, price: 21000 },
    { hours: 2, minutes: 40, price: 23000 },
    { hours: 2, minutes: 50, price: 24000 },
    { hours: 3, minutes: 0, price: 20000 },
    { hours: 3, minutes: 10, price: 22000 },
    { hours: 3, minutes: 20, price: 24000 },
    { hours: 3, minutes: 30, price: 25000 },
    { hours: 3, minutes: 40, price: 26000 },
    { hours: 3, minutes: 50, price: 28000 },
    { hours: 4, minutes: 0, price: 28000 },
    { hours: 4, minutes: 10, price: 30000 },
    { hours: 4, minutes: 20, price: 32000 },
    { hours: 4, minutes: 30, price: 34000 },
    { hours: 4, minutes: 40, price: 35000 },
    { hours: 4, minutes: 50, price: 36000 },
    { hours: 5, minutes: 0, price: 36000 },
    { hours: 5, minutes: 10, price: 38000 },
    { hours: 5, minutes: 20, price: 39000 },
    { hours: 5, minutes: 30, price: 40000 },
    { hours: 5, minutes: 40, price: 41000 },
    { hours: 5, minutes: 50, price: 43000 },
    { hours: 6, minutes: 0, price: 40000 }
  ],
  '31': [
    { hours: 0, minutes: 0, price: 6000 },
    { hours: 1, minutes: 0, price: 6000 },
    { hours: 1, minutes: 5, price: 7000 },
    { hours: 1, minutes: 10, price: 8000 },
    { hours: 1, minutes: 20, price: 9000 },
    { hours: 1, minutes: 30, price: 10000 },
    { hours: 1, minutes: 40, price: 11000 },
    { hours: 1, minutes: 50, price: 12000 },
    { hours: 2, minutes: 0, price: 12000 },
    { hours: 2, minutes: 5, price: 13000 },
    { hours: 2, minutes: 10, price: 14000 },
    { hours: 2, minutes: 20, price: 15000 },
    { hours: 2, minutes: 30, price: 16000 },
    { hours: 2, minutes: 40, price: 17000 },
    { hours: 2, minutes: 50, price: 18000 },
    { hours: 3, minutes: 0, price: 15000 },
    { hours: 3, minutes: 5, price: 16000 },
    { hours: 3, minutes: 10, price: 17000 },
    { hours: 3, minutes: 20, price: 18000 },
    { hours: 3, minutes: 30, price: 19000 },
    { hours: 3, minutes: 40, price: 20000 },
    { hours: 3, minutes: 50, price: 21000 },
    { hours: 4, minutes: 0, price: 21000 },
    { hours: 4, minutes: 5, price: 22000 },
    { hours: 4, minutes: 10, price: 23000 },
    { hours: 4, minutes: 20, price: 24000 },
    { hours: 4, minutes: 30, price: 25000 },
    { hours: 4, minutes: 40, price: 26000 },
    { hours: 4, minutes: 50, price: 27000 },
    { hours: 5, minutes: 0, price: 27000 },
    { hours: 5, minutes: 5, price: 28000 },
    { hours: 5, minutes: 10, price: 29000 },
    { hours: 5, minutes: 20, price: 30000 },
    { hours: 5, minutes: 30, price: 31000 },
    { hours: 5, minutes: 40, price: 32000 },
    { hours: 5, minutes: 50, price: 33000 },
    { hours: 6, minutes: 0, price: 30000 }
  ],
  '32': [
    { hours: 0, minutes: 0, price: 6000 },
    { hours: 1, minutes: 0, price: 6000 },
    { hours: 1, minutes: 5, price: 7000 },
    { hours: 1, minutes: 10, price: 8000 },
    { hours: 1, minutes: 20, price: 9000 },
    { hours: 1, minutes: 30, price: 10000 },
    { hours: 1, minutes: 40, price: 11000 },
    { hours: 1, minutes: 50, price: 12000 },
    { hours: 2, minutes: 0, price: 12000 },
    { hours: 2, minutes: 5, price: 13000 },
    { hours: 2, minutes: 10, price: 14000 },
    { hours: 2, minutes: 20, price: 15000 },
    { hours: 2, minutes: 30, price: 16000 },
    { hours: 2, minutes: 40, price: 17000 },
    { hours: 2, minutes: 50, price: 18000 },
    { hours: 3, minutes: 0, price: 15000 },
    { hours: 3, minutes: 5, price: 16000 },
    { hours: 3, minutes: 10, price: 17000 },
    { hours: 3, minutes: 20, price: 18000 },
    { hours: 3, minutes: 30, price: 19000 },
    { hours: 3, minutes: 40, price: 20000 },
    { hours: 3, minutes: 50, price: 21000 },
    { hours: 4, minutes: 0, price: 21000 },
    { hours: 4, minutes: 5, price: 22000 },
    { hours: 4, minutes: 10, price: 23000 },
    { hours: 4, minutes: 20, price: 24000 },
    { hours: 4, minutes: 30, price: 25000 },
    { hours: 4, minutes: 40, price: 26000 },
    { hours: 4, minutes: 50, price: 27000 },
    { hours: 5, minutes: 0, price: 27000 },
    { hours: 5, minutes: 5, price: 28000 },
    { hours: 5, minutes: 10, price: 29000 },
    { hours: 5, minutes: 20, price: 30000 },
    { hours: 5, minutes: 30, price: 31000 },
    { hours: 5, minutes: 40, price: 32000 },
    { hours: 5, minutes: 50, price: 33000 },
    { hours: 6, minutes: 0, price: 30000 }
  ],
  '33': [
    { hours: 0, minutes: 0, price: 5000 },
    { hours: 1, minutes: 0, price: 5000 },
    { hours: 1, minutes: 5, price: 6000 },
    { hours: 1, minutes: 20, price: 7000 },
    { hours: 1, minutes: 30, price: 8000 },
    { hours: 1, minutes: 40, price: 9000 },
    { hours: 1, minutes: 50, price: 10000 },
    { hours: 2, minutes: 0, price: 10000 },
    { hours: 2, minutes: 5, price: 11000 },
    { hours: 2, minutes: 20, price: 12000 },
    { hours: 2, minutes: 30, price: 13000 },
    { hours: 2, minutes: 40, price: 14000 },
    { hours: 2, minutes: 50, price: 15000 },
    { hours: 3, minutes: 0, price: 13000 },
    { hours: 3, minutes: 5, price: 14000 },
    { hours: 3, minutes: 20, price: 15000 },
    { hours: 3, minutes: 30, price: 16000 },
    { hours: 3, minutes: 40, price: 17000 },
    { hours: 3, minutes: 50, price: 18000 },
    { hours: 4, minutes: 0, price: 18000 },
    { hours: 4, minutes: 5, price: 19000 },
    { hours: 4, minutes: 20, price: 20000 },
    { hours: 4, minutes: 30, price: 21000 },
    { hours: 4, minutes: 40, price: 22000 },
    { hours: 4, minutes: 50, price: 23000 },
    { hours: 5, minutes: 0, price: 23000 },
    { hours: 5, minutes: 5, price: 24000 },
    { hours: 5, minutes: 20, price: 26000 },
    { hours: 5, minutes: 30, price: 27000 },
    { hours: 5, minutes: 40, price: 29000 },
    { hours: 5, minutes: 50, price: 30000 },
    { hours: 6, minutes: 0, price: 26000 }
  ]
};

const CANTEEN_ITEMS: CanteenItem[] = [
  { name: "Kopi", price: 4000 },
  { name: "Nutrisari", price: 4000 },
  { name: "Segar Sari", price: 4000 },
  { name: "Marimas", price: 3000 },
  { name: "Jasjus", price: 3000 },
  { name: "Sisri", price: 3000 },
  { name: "Frenta", price: 3000 },
  { name: "Mie", price: 6000 },
  { name: "Mie Double", price: 10000 },
];

const PlayStationRentalTimer: React.FC = () => {
  const [playSound] = useSound(notificationSound);
  const [timers, setTimers] = useState<Record<Unit, TimerState>>(() => {
    const initialTimerState: TimerState = {
      isRunning: false,
      startTime: null,
      endTime: null,
      displayTime: '0 jam 0 mnt 0 dtk',
      currentPrice: 0,
      isCountdown: false,
      note: '',
      fixedDuration: '',
    };
    
    return {
      '41': { ...initialTimerState },
      '42': { ...initialTimerState },
      '31': { ...initialTimerState },
      '32': { ...initialTimerState },
      '33': { ...initialTimerState },
    };
  });

  const [selectedItems, setSelectedItems] = useState<CanteenItem[]>([]);
  const intervalRefs = useRef<Record<Unit, number | null>>({
    '41': null,
    '42': null,
    '31': null,
    '32': null,
    '33': null,
  });

  const notificationIdRef = useRef(0);

  const calculatePrice = (unit: Unit, hours: number, minutes: number): number => {
    const tiers = PRICE_TIERS[unit];
    if (!tiers || tiers.length === 0) return 0;
    
    for (let i = tiers.length - 1; i >= 0; i--) {
      const tier = tiers[i];
      if (hours > tier.hours || (hours === tier.hours && minutes >= tier.minutes)) {
        return tier.price;
      }
    }
    
    return tiers[0].price;
  };

  const getPriceForDuration = (unit: Unit, durationHours: number): number => {
    return calculatePrice(unit, durationHours, 0);
  };

  const updateTimer = (unit: Unit) => {
    setTimers(prev => {
      const timer = prev[unit];
      if (!timer.startTime) return prev;

      let hours, minutes, seconds;
      
      if (timer.isCountdown && timer.endTime) {
        const now = moment();
        let remaining = moment.duration(timer.endTime.diff(now));

        if (remaining.asMilliseconds() <= 0) {
          if (intervalRefs.current[unit]) {
            window.clearInterval(intervalRefs.current[unit]!);
            intervalRefs.current[unit] = null;
          }
          
          if (timer.isRunning && timer.durationHours) {
            playSound()
            
            const notificationId = notificationIdRef.current++;
            const price = getPriceForDuration(unit, timer.durationHours);
            
            toast.info(
              <div>
                {unit} - {timer.fixedDuration} (Rp {price.toLocaleString('id-ID')})
                <button 
                  onClick={() => toast.dismiss(notificationId)}
                  className="ml-2 text-white"
                >
                  ×
                </button>
              </div>, 
              {
                toastId: notificationId,
                closeButton: false,
                autoClose: false,
              }
            );
          }

          remaining = moment.duration(0);
          hours = 0;
          minutes = 0;
          seconds = 0;
        } else {
          hours = Math.floor(remaining.asHours());
          minutes = remaining.minutes();
          seconds = remaining.seconds();
        }

        return {
          ...prev,
          [unit]: {
            ...timer,
            displayTime: `${hours} jam ${minutes} mnt ${seconds} dtk`, // Show countdown
            currentPrice: getPriceForDuration(unit, timer.durationHours || 0),
            isRunning: true,
          },
        };
      } else {
        const now = moment();
        const elapsedMilliseconds = now.diff(timer.startTime);
        const duration = moment.duration(elapsedMilliseconds);
        hours = Math.floor(duration.asHours());
        minutes = duration.minutes();
        seconds = duration.seconds();

        return {
          ...prev,
          [unit]: {
            ...timer,
            displayTime: `${hours} jam ${minutes} mnt ${seconds} dtk`,
            currentPrice: calculatePrice(unit, hours, minutes),
            isRunning: true,
          },
        };
      }
    });
  };

  const startCountdown = (unit: Unit, hours: number) => {
    setTimers(prev => {
      if (intervalRefs.current[unit]) {
        window.clearInterval(intervalRefs.current[unit]!);
        intervalRefs.current[unit] = null;
      }

      const startTime = moment();
      const endTime = moment(startTime).add(hours, 'hours');
      const price = getPriceForDuration(unit, hours);
      const fixedDuration = `${hours} jam`;

      intervalRefs.current[unit] = window.setInterval(() => updateTimer(unit), 1000);

      return {
        ...prev,
        [unit]: {
          ...prev[unit],
          isRunning: true,
          isCountdown: true,
          startTime,
          endTime,
          durationHours: hours,
          selectedDuration: hours,
          currentPrice: price,
          displayTime: fixedDuration,
          fixedDuration, // Store the fixed duration text
          note: prev[unit].note
        },
      };
    });
  };

  const startStopwatch = (unit: Unit) => {
    setTimers(prev => {
      if (intervalRefs.current[unit]) {
        window.clearInterval(intervalRefs.current[unit]!);
        intervalRefs.current[unit] = null;
      }

      intervalRefs.current[unit] = window.setInterval(() => updateTimer(unit), 1000);

      return {
        ...prev,
        [unit]: {
          ...prev[unit],
          isRunning: true,
          isCountdown: false,
          startTime: moment(),
          endTime: null,
          currentPrice: 0,
          displayTime: '0 jam 0 mnt 0 dtk',
          selectedDuration: undefined,
          fixedDuration: '',
          note: prev[unit].note
        },
      };
    });
  };

  const handleNoteChange = (unit: Unit, value: string) => {
    setTimers(prev => ({
      ...prev,
      [unit]: {
        ...prev[unit],
        note: value
      }
    }));
  };

  const finishTimer = async (unit: Unit) => {
    const timer = timers[unit];
    if (!timer.isRunning) return;

    if (intervalRefs.current[unit]) {
      window.clearInterval(intervalRefs.current[unit]!);
      intervalRefs.current[unit] = null;
    }

    // Use fixed duration for countdown, actual time for stopwatch
    const playFor = timer.isCountdown 
      ? timer.fixedDuration || `${timer.durationHours} jam`
      : timer.displayTime;

    const payload = {
      unit,
      playFor,
      grandTotal: timer.currentPrice,
      note: timer.note
    };

    try {
      const response = await fetch('http://localhost:8900/rent/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setTimers(prev => ({
        ...prev,
        [unit]: {
          isRunning: false,
          startTime: null,
          endTime: null,
          displayTime: '0 jam 0 mnt 0 dtk',
          currentPrice: 0,
          isCountdown: false,
          selectedDuration: undefined,
          fixedDuration: '',
          note: ''
        },
      }));
    } catch (error) {
      console.error(`Error finishing timer for unit ${unit}:`, error);
    }
  };

  const handleAddItem = (item: CanteenItem) => {
    setSelectedItems(prev => [...prev, item]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const submitCanteenOrder = async () => {
    if (selectedItems.length === 0) return;

    try {
      for (const item of selectedItems) {
        const payload = {
          item: item.name,
          grandTotal: item.price
        };

        const response = await fetch('http://localhost:8900/canteen/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to submit canteen order');
        }
      }

      toast.success("Canteen order submitted successfully!");
      setSelectedItems([]);
    } catch (error) {
      console.error('Error submitting canteen order:', error);
      toast.error("Failed to submit canteen order");
    }
  };

  return (
    <div className="min-h-screen p-4 m-0">
      <ToastContainer 
        position="top-right"
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      
      <h1 className="text-2xl font-bold text-center mb-6">TIMER LTS GAME</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* PlayStation Rental Timers */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(timers) as Unit[]).map((unit) => (
              <div key={unit} className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                            <h2 className="text-6xl font-bold text-center text-slate-500 mb-1">{unit}</h2>
            
            <div className="mb-4 text-center">
              <div className="text-xl font-bold mb-2 text-slate-500">{timers[unit].displayTime}</div>
              <div className="text-5xl font-semibold text-blue-500">
                Rp {timers[unit].currentPrice.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={timers[unit].note}
                onChange={(e) => handleNoteChange(unit, e.target.value)}
                placeholder="note.."
                className="w-full px-2 border border-gray-300 bg-gray-300 rounded-lg text-slate-500"
                disabled={!timers[unit].isRunning}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[1, 2, 3, 6].map((hours) => (
                <button
                  key={hours}
                  onClick={() => startCountdown(unit, hours)}
                  className={`rounded-md text-sm ${
                    timers[unit].selectedDuration === hours
                      ? 'bg-blue-500 text-white'
                      : timers[unit].isRunning
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-500'
                  }`}
                  disabled={timers[unit].isRunning}
                >
                  {hours} Jam
                </button>
              ))}
            </div>

            <div className="flex justify-center space-x-2">
              {!timers[unit].isRunning ? (
                <button
                  onClick={() => startStopwatch(unit)}
                  className="bg-gray-300 hover:bg-gray-400 px-2 rounded-md"
                >
                  <p className='text-gray-500 text-sm px-3'>Open</p>
                </button>
              ) : (
                <button
                  onClick={() => finishTimer(unit)}
                  className="bg-red-500 hover:bg-red-600 px-3 rounded-md"
                >
                  <p className='text-white text-sm px-3'>Selesai</p>
                </button>
              )}
            </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canteen Items Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl text-slate-500 font-bold text-center mb-4">Canteen</h2>
          
          <div className="space-y-2 mb-4">
            {CANTEEN_ITEMS.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <span><p className='text-slate-500'>{item.name}</p></span>
                <div className="flex items-center">
                  <span className="mr-2"><p className='text-slate-500'>Rp {item.price.toLocaleString('id-ID')} </p></span>
                  <button 
                    onClick={() => handleAddItem(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Items */}
          <div className="mb-4">
            <h3 className="text-slate-500 font-semibold mb-2">Selected Items:</h3>
            {selectedItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No items selected</p>
            ) : (
              <ul className="space-y-1">
                {selectedItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span><p className='text-slate-500'>{item.name}</p></span>
                    <div className="flex items-center">
                      <span className="mr-2"><p className='text-slate-500'>Rp {item.price.toLocaleString('id-ID')}</p></span>
                      <button 
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Total and Submit */}
          {selectedItems.length > 0 && (
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold mb-3">
                <span>Total:</span>
                <span>
                  <p className='text-slate-500'>Rp {selectedItems.reduce((sum, item) => sum + item.price, 0).toLocaleString('id-ID')}</p>
                </span>
              </div>
              <button
                onClick={submitCanteenOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
              >
                Submit Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayStationRentalTimer;