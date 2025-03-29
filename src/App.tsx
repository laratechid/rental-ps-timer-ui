import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';

type Unit = '41' | '42' | '31' | '32' | '33';

interface PriceTier {
  hours: number;
  minutes: number;
  price: number;
}

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: moment.Moment | null;
  pausedTime: moment.Moment | null;
  totalPausedDuration: number;
  displayTime: string;
  currentPrice: number;
}

const PRICE_TIERS: Record<Unit, PriceTier[]> = {
  '41': [
    { hours: 0, minutes: 0, price: 8000 },
    { hours: 1, minutes: 0, price: 8000 },
    { hours: 1, minutes: 10, price: 10000 },
    { hours: 1, minutes: 20, price: 11000 },
    { hours: 1, minutes: 30, price: 12000 },
    { hours: 1, minutes: 40, price: 14000 },
    { hours: 1, minutes: 50, price: 15000 },
    { hours: 2, minutes: 0, price: 16000 },
    { hours: 2, minutes: 10, price: 18000 },
    { hours: 2, minutes: 20, price: 19000 },
    { hours: 2, minutes: 30, price: 20000 },
    { hours: 2, minutes: 40, price: 22000 },
    { hours: 2, minutes: 50, price: 23000 },
    { hours: 3, minutes: 0, price: 20000 },
    { hours: 3, minutes: 10, price: 22000 },
    { hours: 3, minutes: 20, price: 23000 },
    { hours: 3, minutes: 30, price: 25000 },
    { hours: 3, minutes: 40, price: 26000 },
    { hours: 3, minutes: 50, price: 28000 },
    { hours: 4, minutes: 0, price: 28000 },
    { hours: 4, minutes: 10, price: 30000 },
    { hours: 4, minutes: 20, price: 31000 },
    { hours: 4, minutes: 30, price: 33000 },
    { hours: 4, minutes: 40, price: 34000 },
    { hours: 4, minutes: 50, price: 36000 },
    { hours: 5, minutes: 0, price: 32000 },
    { hours: 5, minutes: 10, price: 34000 },
    { hours: 5, minutes: 20, price: 35000 },
    { hours: 5, minutes: 30, price: 37000 },
    { hours: 5, minutes: 40, price: 38000 },
    { hours: 5, minutes: 50, price: 40000 },
    { hours: 6, minutes: 0, price: 40000 }
  ],
  '42': [
    { hours: 0, minutes: 0, price: 8000 },
    { hours: 1, minutes: 0, price: 8000 },
    { hours: 1, minutes: 10, price: 10000 },
    { hours: 1, minutes: 20, price: 11000 },
    { hours: 1, minutes: 30, price: 12000 },
    { hours: 1, minutes: 40, price: 14000 },
    { hours: 1, minutes: 50, price: 15000 },
    { hours: 2, minutes: 0, price: 16000 },
    { hours: 2, minutes: 10, price: 18000 },
    { hours: 2, minutes: 20, price: 19000 },
    { hours: 2, minutes: 30, price: 20000 },
    { hours: 2, minutes: 40, price: 22000 },
    { hours: 2, minutes: 50, price: 23000 },
    { hours: 3, minutes: 0, price: 20000 },
    { hours: 3, minutes: 10, price: 22000 },
    { hours: 3, minutes: 20, price: 23000 },
    { hours: 3, minutes: 30, price: 25000 },
    { hours: 3, minutes: 40, price: 26000 },
    { hours: 3, minutes: 50, price: 28000 },
    { hours: 4, minutes: 0, price: 28000 },
    { hours: 4, minutes: 10, price: 30000 },
    { hours: 4, minutes: 20, price: 31000 },
    { hours: 4, minutes: 30, price: 33000 },
    { hours: 4, minutes: 40, price: 34000 },
    { hours: 4, minutes: 50, price: 36000 },
    { hours: 5, minutes: 0, price: 32000 },
    { hours: 5, minutes: 10, price: 34000 },
    { hours: 5, minutes: 20, price: 35000 },
    { hours: 5, minutes: 30, price: 37000 },
    { hours: 5, minutes: 40, price: 38000 },
    { hours: 5, minutes: 50, price: 40000 },
    { hours: 6, minutes: 0, price: 40000 }
  ],
  '31': [
    { hours: 0, minutes: 0, price: 6000 },
    { hours: 1, minutes: 0, price: 6000 },
    { hours: 1, minutes: 10, price: 7000 },
    { hours: 1, minutes: 20, price: 8000 },
    { hours: 1, minutes: 30, price: 9000 },
    { hours: 1, minutes: 40, price: 10000 },
    { hours: 1, minutes: 50, price: 11000 },
    { hours: 2, minutes: 0, price: 12000 },
    { hours: 2, minutes: 10, price: 13000 },
    { hours: 2, minutes: 20, price: 14000 },
    { hours: 2, minutes: 30, price: 15000 },
    { hours: 2, minutes: 40, price: 16000 },
    { hours: 2, minutes: 50, price: 17000 },
    { hours: 3, minutes: 0, price: 15000 },
    { hours: 3, minutes: 10, price: 16000 },
    { hours: 3, minutes: 20, price: 17000 },
    { hours: 3, minutes: 30, price: 18000 },
    { hours: 3, minutes: 40, price: 19000 },
    { hours: 3, minutes: 50, price: 20000 },
    { hours: 4, minutes: 0, price: 21000 },
    { hours: 4, minutes: 10, price: 22000 },
    { hours: 4, minutes: 20, price: 23000 },
    { hours: 4, minutes: 30, price: 24000 },
    { hours: 4, minutes: 40, price: 25000 },
    { hours: 4, minutes: 50, price: 26000 },
    { hours: 5, minutes: 0, price: 27000 },
    { hours: 5, minutes: 10, price: 28000 },
    { hours: 5, minutes: 20, price: 30000 },
    { hours: 5, minutes: 30, price: 31000 },
    { hours: 5, minutes: 40, price: 33000 },
    { hours: 5, minutes: 50, price: 34000 },
    { hours: 6, minutes: 0, price: 30000 }
  ],
  '32': [
    { hours: 0, minutes: 0, price: 5000 },
    { hours: 1, minutes: 0, price: 5000 },
    { hours: 1, minutes: 10, price: 6000 },
    { hours: 1, minutes: 20, price: 7000 },
    { hours: 1, minutes: 30, price: 8000 },
    { hours: 1, minutes: 40, price: 9000 },
    { hours: 1, minutes: 50, price: 10000 },
    { hours: 2, minutes: 0, price: 10000 },
    { hours: 2, minutes: 10, price: 11000 },
    { hours: 2, minutes: 20, price: 12000 },
    { hours: 2, minutes: 30, price: 13000 },
    { hours: 2, minutes: 40, price: 14000 },
    { hours: 2, minutes: 50, price: 15000 },
    { hours: 3, minutes: 0, price: 13000 },
    { hours: 3, minutes: 10, price: 14000 },
    { hours: 3, minutes: 20, price: 15000 },
    { hours: 3, minutes: 30, price: 16000 },
    { hours: 3, minutes: 40, price: 17000 },
    { hours: 3, minutes: 50, price: 18000 },
    { hours: 4, minutes: 0, price: 18000 },
    { hours: 4, minutes: 10, price: 19000 },
    { hours: 4, minutes: 20, price: 20000 },
    { hours: 4, minutes: 30, price: 21000 },
    { hours: 4, minutes: 40, price: 22000 },
    { hours: 4, minutes: 50, price: 23000 },
    { hours: 5, minutes: 0, price: 23000 },
    { hours: 5, minutes: 10, price: 24000 },
    { hours: 5, minutes: 20, price: 26000 },
    { hours: 5, minutes: 30, price: 27000 },
    { hours: 5, minutes: 40, price: 29000 },
    { hours: 5, minutes: 50, price: 30000 },
    { hours: 6, minutes: 0, price: 26000 }
  ],
  '33': [
    { hours: 0, minutes: 0, price: 5000 },
    { hours: 1, minutes: 0, price: 5000 },
    { hours: 1, minutes: 10, price: 6000 },
    { hours: 1, minutes: 20, price: 7000 },
    { hours: 1, minutes: 30, price: 8000 },
    { hours: 1, minutes: 40, price: 9000 },
    { hours: 1, minutes: 50, price: 10000 },
    { hours: 2, minutes: 0, price: 10000 },
    { hours: 2, minutes: 10, price: 11000 },
    { hours: 2, minutes: 20, price: 12000 },
    { hours: 2, minutes: 30, price: 13000 },
    { hours: 2, minutes: 40, price: 14000 },
    { hours: 2, minutes: 50, price: 15000 },
    { hours: 3, minutes: 0, price: 13000 },
    { hours: 3, minutes: 10, price: 14000 },
    { hours: 3, minutes: 20, price: 15000 },
    { hours: 3, minutes: 30, price: 16000 },
    { hours: 3, minutes: 40, price: 17000 },
    { hours: 3, minutes: 50, price: 18000 },
    { hours: 4, minutes: 0, price: 18000 },
    { hours: 4, minutes: 10, price: 19000 },
    { hours: 4, minutes: 20, price: 20000 },
    { hours: 4, minutes: 30, price: 21000 },
    { hours: 4, minutes: 40, price: 22000 },
    { hours: 4, minutes: 50, price: 23000 },
    { hours: 5, minutes: 0, price: 23000 },
    { hours: 5, minutes: 10, price: 24000 },
    { hours: 5, minutes: 20, price: 26000 },
    { hours: 5, minutes: 30, price: 27000 },
    { hours: 5, minutes: 40, price: 29000 },
    { hours: 5, minutes: 50, price: 30000 },
    { hours: 6, minutes: 0, price: 26000 }
  ]
};

const PlayStationRentalTimer: React.FC = () => {
  const [timers, setTimers] = useState<Record<Unit, TimerState>>(() => {
    const initialTimerState: TimerState = {
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: null,
      totalPausedDuration: 0,
      displayTime: '0 jam 0 mnt 0 dtk',
      currentPrice: 0,
    };
    
    return {
      '41': { ...initialTimerState },
      '42': { ...initialTimerState },
      '31': { ...initialTimerState },
      '32': { ...initialTimerState },
      '33': { ...initialTimerState },
    };
  });

  const intervalRefs = useRef<Record<Unit, number | null>>({
    '41': null,
    '42': null,
    '31': null,
    '32': null,
    '33': null,
  });

  const calculatePrice = (unit: Unit, hours: number, minutes: number): number => {
    const tiers = PRICE_TIERS[unit];
    
    // Find the first tier where time is >= tier time
    for (let i = tiers.length - 1; i >= 0; i--) {
      const tier = tiers[i];
      if (hours > tier.hours || (hours === tier.hours && minutes >= tier.minutes)) {
        return tier.price;
      }
    }
    
    // Default to first tier price
    return tiers[0].price;
  };

  const updateTimer = (unit: Unit) => {
    try {
      setTimers(prev => {
        const timer = prev[unit];
        if (!timer.startTime) return prev;

        const now = moment();
        let elapsedMilliseconds = now.diff(timer.startTime);

        if (timer.totalPausedDuration > 0) {
          elapsedMilliseconds -= timer.totalPausedDuration;
        }

        if (timer.isPaused && timer.pausedTime) {
          elapsedMilliseconds = timer.pausedTime.diff(timer.startTime) - timer.totalPausedDuration;
        }

        const duration = moment.duration(elapsedMilliseconds);
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        return {
          ...prev,
          [unit]: {
            ...timer,
            displayTime: `${hours} jam ${minutes} mnt ${seconds} dtk`,
            currentPrice: calculatePrice(unit, hours, minutes),
          },
        };
      });
    } catch (error) {
      console.error(`Error updating timer for unit ${unit}:`, error);
    }
  };

  const startTimer = (unit: Unit) => {
    try {
      setTimers(prev => {
        const timer = prev[unit];
        
        // Bersihkan interval sebelumnya jika ada
        if (intervalRefs.current[unit]) {
          window.clearInterval(intervalRefs.current[unit]!);
          intervalRefs.current[unit] = null;
        }

        // Set interval baru
        intervalRefs.current[unit] = window.setInterval(() => updateTimer(unit), 1000);

        if (timer.isPaused) {
          // Resume dari pause
          const now = moment();
          const pauseDuration = now.diff(timer.pausedTime!);
          
          return {
            ...prev,
            [unit]: {
              ...timer,
              isRunning: true,
              isPaused: false,
              pausedTime: null,
              totalPausedDuration: timer.totalPausedDuration + pauseDuration,
            },
          };
        } else {
          // Mulai baru
          return {
            ...prev,
            [unit]: {
              ...timer,
              isRunning: true,
              startTime: moment(),
              totalPausedDuration: 0,
            },
          };
        }
      });
    } catch (error) {
      console.error(`Error starting timer for unit ${unit}:`, error);
    }
  };

  const pauseTimer = (unit: Unit) => {
    try {
      setTimers(prev => {
        const timer = prev[unit];
        if (!timer.isRunning || timer.isPaused) return prev;

        // Bersihkan interval
        if (intervalRefs.current[unit]) {
          window.clearInterval(intervalRefs.current[unit]!);
          intervalRefs.current[unit] = null;
        }

        return {
          ...prev,
          [unit]: {
            ...timer,
            isPaused: true,
            pausedTime: moment(),
          },
        };
      });
    } catch (error) {
      console.error(`Error pausing timer for unit ${unit}:`, error);
    }
  };

  const finishTimer = async (unit: Unit) => {
    try {
      const timer = timers[unit];
      if (!timer.isRunning) return;

      // Bersihkan interval
      if (intervalRefs.current[unit]) {
        window.clearInterval(intervalRefs.current[unit]!);
        intervalRefs.current[unit] = null;
      }

      // Kirim data ke server
      const payload = {
        unit,
        playFor: timer.displayTime,
        grandTotal: timer.currentPrice
      };

      const response = await fetch('http://localhost:8900/rent/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Reset timer
      setTimers(prev => ({
        ...prev,
        [unit]: {
          isRunning: false,
          isPaused: false,
          startTime: null,
          pausedTime: null,
          totalPausedDuration: 0,
          displayTime: '0 jam 0 mnt 0 dtk',
          currentPrice: 0,
        },
      }));
    } catch (error) {
      console.error(`Error finishing timer for unit ${unit}:`, error);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup semua interval saat komponen unmount
      Object.entries(intervalRefs.current).forEach(([unit, interval]) => {
        if (interval) {
          window.clearInterval(interval);
          intervalRefs.current[unit as Unit] = null;
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 m-0">
      <h1 className="text-2xl font-bold text-center mb-6">PlayStation Rental Timers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(timers) as Unit[]).map((unit) => (
          <div key={unit} className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h2 className="text-xl font-bold text-center mb-4">Unit {unit}</h2>
            
            <div className="mb-4 text-center">
              <div className="text-3xl font-bold mb-2">{timers[unit].displayTime}</div>
              <div className="text-xl font-semibold text-green-600">
                Rp {timers[unit].currentPrice.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              {!timers[unit].isRunning ? (
                <button
                  onClick={() => startTimer(unit)}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium text-sm"
                >
                  Mulai
                </button>
              ) : (
                <>
                  {!timers[unit].isPaused ? (
                    <button
                      onClick={() => pauseTimer(unit)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md font-medium text-sm"
                    >
                      Jeda
                    </button>
                  ) : (
                    <button
                      onClick={() => startTimer(unit)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium text-sm"
                    >
                      Lanjutkan
                    </button>
                  )}
                  <button
                    onClick={() => finishTimer(unit)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium text-sm"
                  >
                    Selesai
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayStationRentalTimer;