import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Import date-fns for date manipulation and formatting
import { addDays, format, isSameDay, setHours, setMinutes } from "date-fns";

// ----------------------
// Type definitions
// ----------------------
interface ScheduleTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Final submission data: contains selected dates and specific available time slots for each date
  onSubmit: (availability: { date: Date; slots: string[] }[]) => void;
  initialData?: { date: string; slots: string[] }[] | null;
  confirmedData?: { date: string; slots: string[] }[] | null;
  title?: string;
  isBuyer?: boolean;
}

const SchedulePickupModal: React.FC<ScheduleTimeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  confirmedData,
  title,
  isBuyer,
}) => {
  // --- State Management ---
  const [step, setStep] = useState<1 | 2>(1); // 1: Select date range, 2: Select specific time slots
  
  // Step 1 States
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  // Step 2 States: Record selected specific time blocks (Format: "YYYY-MM-DD_HH:mm")
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [availableSlots, setAvailableSlots] = useState<Set<string>>(new Set());

  // Step 2 Dragging States
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ dateKey: string; time: string } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ dateKey: string; time: string } | null>(null);
  const [dragAction, setDragAction] = useState<"select" | "deselect">("select");

  const initialDataStr = JSON.stringify(initialData);
  const isSellerReadOnly = !isBuyer && !!initialData && initialData.length > 0;
  const isConfirmed = !!confirmedData && confirmedData.length > 0;

  // --- Initialization and Reset ---
  useEffect(() => {
    if (isOpen) {
      // If there is initial data (e.g. from Seller), load it
      if (initialData && initialData.length > 0) {
        const dates: Date[] = [];
        const slots = new Set<string>();

        initialData.forEach((item) => {
          const dateObj = new Date(item.date);
          dates.push(dateObj);
          item.slots.forEach((time) => {
            slots.add(`${format(dateObj, "yyyy-MM-dd")}_${time}`);
          });
        });

        setSelectedDates(dates); 
        
        if (confirmedData && confirmedData.length > 0) {
          // If confirmed, show initialData as available (light green) and confirmedData as selected (dark green)
          setAvailableSlots(slots);
          
          const confirmedSet = new Set<string>();
          confirmedData.forEach((item) => {
            const dateObj = new Date(item.date);
            item.slots.forEach((time) => {
              confirmedSet.add(`${format(dateObj, "yyyy-MM-dd")}_${time}`);
            });
          });
          setSelectedSlots(confirmedSet);
        } else if (isBuyer) {
          setAvailableSlots(slots);
          setSelectedSlots(new Set());
        } else {
          setSelectedSlots(slots);
          setAvailableSlots(new Set());
        }
        setStep(2);
      } else {
        setStep(1);
        setSelectedDates([]);
        setSelectedSlots(new Set());
        setAvailableSlots(new Set());
      }
    }
  }, [isOpen, initialDataStr, isBuyer, confirmedData]);

  // Global mouse up to stop dragging even if mouse leaves the element
  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [isDragging, dragStart, dragCurrent]);

  if (!isOpen) return null;

  // --- Step 1 Logic: Handle date multi-selection ---
  const handleDateSelect = (date: Date) => {
    const exists = selectedDates.find((d) => isSameDay(d, date));
    if (exists) {
      // If already selected, deselect
      setSelectedDates(selectedDates.filter((d) => !isSameDay(d, date)));
    } else {
      // If not selected, add
      setSelectedDates([...selectedDates, date].sort((a, b) => a.getTime() - b.getTime()));
    }
  };

  // Generate time options for dropdown (00:00 - 23:00)
  const timeOptions = Array.from({ length: 24 }).map((_, i) => {
    const hour = i;
    const label = hour === 0 ? "12:00 AM" : hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;
    const value = `${hour.toString().padStart(2, "0")}:00`;
    return { value, label };
  });

  // --- Step 2 Logic: Generate time grid ---
  const generateTimeSlots = () => {
    const startH = parseInt(startTime.split(":")[0]);
    const endH = parseInt(endTime.split(":")[0]);
    const slots: string[] = [];

    for (let h = startH; h < endH; h++) {
      // :00
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      // :30
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    // Add the final end hour (if the end point itself needs to be included; usually time slots are left-closed, right-open; assuming display up to before the end here)
    // For UI display purposes, we usually show the slot start time
    return slots;
  };

  // Generate timeline labels (including end time, for aligning grid lines)
  const generateTimeLabels = () => {
    const slots = generateTimeSlots();
    if (slots.length === 0) return [];
    
    const lastSlot = slots[slots.length - 1];
    const [h, m] = lastSlot.split(':').map(Number);
    let nextH = h;
    let nextM = m + 30;
    if (nextM >= 60) {
        nextH += 1;
        nextM -= 60;
    }
    const endTimeStr = `${nextH.toString().padStart(2, '0')}:${nextM.toString().padStart(2, '0')}`;
    
    return [...slots, endTimeStr];
  };

  // --- Drag Selection Logic ---
  const getSlotsInRange = (start: string, end: string) => {
    const toMins = (t: string) => parseInt(t.split(':')[0]) * 60 + parseInt(t.split(':')[1]);
    const startMins = toMins(start);
    const endMins = toMins(end);
    const min = Math.min(startMins, endMins);
    const max = Math.max(startMins, endMins);
    
    const allSlots = generateTimeSlots();
    return allSlots.filter(t => {
        const m = toMins(t);
        return m >= min && m <= max;
    });
  };

  const handleMouseDown = (dateKey: string, time: string) => {
    if (isSellerReadOnly) return;
    if (isConfirmed) return;

    const key = `${dateKey}_${time}`;
    const isSelected = selectedSlots.has(key);

    if (isBuyer) {
      // Buyer can only select from available slots, and only one at a time
      if (availableSlots.has(key)) {
        const newSet = new Set<string>();
        if (!isSelected) {
          newSet.add(key);
        }
        setSelectedSlots(newSet);
      }
      return;
    }
    
    setIsDragging(true);
    setDragStart({ dateKey, time });
    setDragCurrent({ dateKey, time });
    setDragAction(isSelected ? "deselect" : "select");
  };

  const handleMouseEnter = (dateKey: string, time: string) => {
    if (isSellerReadOnly) return;
    if (isConfirmed) return;
    if (isBuyer) return; // Disable dragging for Buyer
    if (!isDragging || !dragStart) return;
    // Only allow dragging within the same day column
    if (dateKey !== dragStart.dateKey) return;
    setDragCurrent({ dateKey, time });
  };

  const handleDragEnd = () => {
    if (!isDragging || !dragStart || !dragCurrent) {
        setIsDragging(false);
        setDragStart(null);
        setDragCurrent(null);
        return;
    }

    const newSet = new Set(selectedSlots);
    const slotsToModify = getSlotsInRange(dragStart.time, dragCurrent.time);
    
    slotsToModify.forEach(time => {
        const key = `${dragStart.dateKey}_${time}`;
        if (dragAction === "select") newSet.add(key);
        else newSet.delete(key);
    });

    setSelectedSlots(newSet);
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  const isSlotSelected = (dateKey: string, time: string) => {
    const key = `${dateKey}_${time}`;
    const isSelectedInState = selectedSlots.has(key);

    if (!isDragging || !dragStart || dragStart.dateKey !== dateKey) return isSelectedInState;

    const slotsInRange = getSlotsInRange(dragStart.time, dragCurrent!.time);
    if (slotsInRange.includes(time)) {
        return dragAction === "select";
    }
    return isSelectedInState;
  };

  // Format display time (09:00 -> 9:00 AM)
  const formatTimeDisplay = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    const date = setMinutes(setHours(new Date(), h), m);
    return format(date, "h:mm aa");
  };

  // --- Submission Logic ---
  const handleFinalSubmit = () => {
    // Convert Set back to structured data
    const result = selectedDates.map(date => {
        const dateKey = format(date, "yyyy-MM-dd");
        // Find all selected slots for this date
        const slotsForDate = Array.from(selectedSlots)
            .filter(key => key.startsWith(dateKey))
            .map(key => key.split("_")[1]); // Extract HH:mm
        return { date, slots: slotsForDate };
    }).filter(item => item.slots.length > 0); // Filter out dates with no selected times

    onSubmit(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-8">
      <div className={`bg-[#F3F6F4] ${
          step === 1 ? "w-[700px]" : "w-fit min-w-[500px] max-w-[90vw] h-[80vh]"
        } max-h-full min-h-[400px] rounded-2xl px-8 pt-8 pb-6 relative shadow-xl flex flex-col transition-all`}>
        
        {step === 2 && !isSellerReadOnly && !isConfirmed && (
          <button
            onClick={() => setStep(1)}
            className="absolute top-7 left-8 text-gray-500 hover:text-gray-700 font-medium z-10 flex items-center gap-1"
          >
            &larr; Back
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
        >
          &times;
        </button>

        {/* ================= STEP 1: Select Date and Range ================= */}
        {step === 1 && (
          <div className="flex flex-col h-full pt-2">
            <div className="flex flex-row gap-6 flex-1">
              
              {/* Left side: Calendar */}
              <div className="w-1/2 flex flex-col items-center border-r border-gray-200 pr-4 pt-4">
                <h3 className="text-md font-semibold text-green-dark mb-4 text-center">
                  What dates might work in 1 week?
                </h3>
                
                {/* Custom styled DatePicker */}
                <style>{`
                  .react-datepicker { border: none; background: transparent; font-family: inherit; }
                  .react-datepicker__header { background: transparent; border-bottom: none; }
                  .react-datepicker__day-name { color: #666; width: 1.7rem; }
                  .react-datepicker__day { width: 1.7rem; line-height: 1.7rem; margin: 0.1rem; border-radius: 50%; }
                  /* Force hover state to remain circular */
                  .react-datepicker__day:hover {
                    border-radius: 50% !important;
                  }

                  /* 1. Force clear default background on keyboard selection/focus (for unselected dates) */
                  .react-datepicker__day--keyboard-selected:not(.react-datepicker__day--highlighted) { 
                    background-color: transparent !important; 
                    color: inherit !important; 
                    border: none !important;
                    outline: none !important;
                  }

                  /* 2. Selected date style - Dark Green */
                  .react-datepicker__day--highlighted { 
                    background-color: var(--color-green-dark) !important; 
                    color: white !important; 
                    border-radius: 50%;
                  }
                  
                  /* 3. Ensure focus + selected state is also Dark Green */
                  .react-datepicker__day--highlighted:hover,
                  .react-datepicker__day--highlighted:focus,
                  .react-datepicker__day--highlighted.react-datepicker__day--keyboard-selected {
                    background-color: var(--color-green-dark) !important;
                    color: white !important;
                  }

                  .react-datepicker__day--today { font-weight: bold; }
                  
                  /* Disabled date (unselectable) style: Do not change background color and font color on Hover */
                  .react-datepicker__day--disabled {
                    color: #ccc !important;
                  }
                  .react-datepicker__day--disabled:hover {
                    background-color: transparent !important;
                    color: #ccc !important;
                    cursor: default;
                  }

                  /* Custom dropdown arrow style */
                  .custom-select {
                    appearance: none;
                    -webkit-appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 0.5rem center;
                    background-size: 1rem;
                    padding-right: 1.25rem !important;
                    padding-left: 1.25rem !important;
                  }
                `}</style>
                
                <DatePicker
                  inline
                  selected={null} 
                  onChange={handleDateSelect}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 6)} 
                  highlightDates={selectedDates} 
                  dayClassName={(date) => 
                     selectedDates.find(d => isSameDay(d, date)) ? "font-bold" : ""
                  }
                />
              </div>

              {/* Right side: Time range */}
              <div className="w-1/2 pt-4 pl-4 flex flex-col justify-center">
                <h3 className="text-md font-semibold text-green-dark mb-6 text-center">
                  What times might work?
                </h3>

                <div className="space-y-3 max-w-[300px]">
                  {/* No earlier than */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600 font-medium">No earlier than:</label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="custom-select text-sm ml-4 border border-gray-300 rounded-md p-2 bg-white text-gray-700 outline-none focus:border-green-dark"
                    >
                      {timeOptions.map(opt => (
                        <option key={`start-${opt.value}`} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* No later than */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600 font-medium">No later than:</label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="custom-select text-sm ml-4 border border-gray-300 rounded-md p-2 bg-white text-gray-700 outline-none focus:border-green-dark"
                    >
                      {timeOptions.filter(t => parseInt(t.value) > parseInt(startTime)).map(opt => (
                         <option key={`end-${opt.value}`} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Time Zone */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600 font-medium">Time Zone:</label>
                    <div className="ml-4 border border-gray-300 rounded-md p-2 bg-white text-gray-500 w-[140px] text-sm text-center">
                      Europe/Helsinki
                    </div>
                  </div>

                  {/* Next Button */}
                 
                  </div>

                  <div className="flex justify-end pt-10">
                    <button
                      onClick={() => setStep(2)}
                      disabled={selectedDates.length === 0} // Must select at least one date
                      className={`px-8 py-2.5 rounded-full font-semibold text-md transition-colors ${
                        selectedDates.length > 0
                          ? "bg-green-dark text-white hover:bg-opacity-90 cursor-pointer" // Green active
                          : "bg-gray-300 text-gray-500 cursor-not-allowed" // Gray disabled
                      }`}
                    >
                      Next
                    </button>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Your Availability ================= */}
        {step === 2 && (
          <div className="flex flex-col h-full w-full min-h-0">
            <h2 className="text-xl font-bold text-green-dark text-center mb-4 shrink-0">
               {title || "My Availability"}
            </h2>
            
            {/* Time grid container */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto border border-gray-200 rounded-xl bg-white p-4">
               <div className="flex flex-row w-fit mx-auto">
                  {/* --- New: Left side timeline --- */}
                  <div className="flex flex-col min-w-[70px] sticky left-0 bg-white z-10 border-r border-gray-100 mr-4">
                      {/* Placeholder Header (Consistent height with right side date Header to ensure alignment below) */}
                      <div className="mb-4 text-center opacity-0 pointer-events-none">
                          <div className="text-sm uppercase">MMM D</div>
                          <div className="text-lg font-bold">EEE</div>
                      </div>
                      {/* Time label list (pt-[1px] to compensate for right container border width) */}
                      <div className="relative w-full" style={{ height: `${generateTimeSlots().length * 2}rem` }}>
                          {generateTimeLabels().map((time, index) => (
                              <div 
                                  key={time} 
                                  className="absolute w-full flex items-center justify-end pr-3 text-xs text-gray-500 font-medium"
                                  style={{ top: `${index * 2}rem`, transform: 'translateY(-50%)' }}
                              >
                                  {formatTimeDisplay(time)}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* --- Right side: Date columns --- */}
                  <div className="flex flex-row gap-4 flex-1">
                  {/* Render a column for each selected date */}
                  {selectedDates.map((date, index) => {
                      const timeSlots = generateTimeSlots();
                      return (
                          <div key={index} className="flex flex-col items-center min-w-[100px]">
                              {/* Column Header: Date */}
                              <div className="mb-4 text-center">
                                  <div className="text-gray-500 text-sm uppercase">{format(date, "MMM d")}</div>
                                  <div className="text-green-dark font-bold text-lg">{format(date, "EEE")}</div>
                              </div>
                              
                              {/* Time block list */}
                              <div className="flex flex-col gap-2 w-full">
                                <div className="flex flex-col w-full bg-[#E9F1EB] rounded-lg overflow-hidden border border-gray-300 select-none">
                                    {timeSlots.map((time, idx) => {
                                        const dateKey = format(date, "yyyy-MM-dd");
                                        const isSelected = isSlotSelected(dateKey, time);
                                        const isAvailable = availableSlots.has(`${dateKey}_${time}`);
                                        const isHourMark = time.endsWith(":30"); // If slot is 09:30, bottom border is 10:00 (Hour mark)
                                        const isLast = idx === timeSlots.length - 1;

                                        let slotClassName = `w-full h-8 flex items-center justify-center text-xs font-medium transition-colors `;
                                        
                                        if (isBuyer || isConfirmed) {
                                          if (isSelected) slotClassName += `bg-green-dark text-white ${isConfirmed ? "cursor-default" : "cursor-pointer"}`;
                                          else if (isAvailable) slotClassName += `bg-[#A5C9B1] text-white ${isConfirmed ? "cursor-default" : "hover:opacity-90 cursor-pointer"}`;
                                          else slotClassName += `text-gray-300 ${isConfirmed ? "cursor-default" : "cursor-not-allowed"}`;
                                        } else {
                                          if (isSellerReadOnly) {
                                            slotClassName += "cursor-default ";
                                            if (isSelected) slotClassName += "bg-[#A5C9B1] text-white";
                                            else slotClassName += "text-gray-600";
                                          } else {
                                            slotClassName += "cursor-pointer ";
                                            if (isSelected) slotClassName += "bg-[#A5C9B1] text-white";
                                            else slotClassName += "hover:bg-[#D4E2D8] text-gray-600";
                                          }
                                        }

                                        if (!isLast) {
                                          slotClassName += isHourMark ? " border-b border-gray-400" : " border-b border-gray-300";
                                        }

                                        return (
                                            <div
                                                key={time}
                                                onMouseDown={() => handleMouseDown(dateKey, time)}
                                                onMouseEnter={() => handleMouseEnter(dateKey, time)}
                                                className={slotClassName}
                                            >
                                                {/* Time text moved to left axis, leave empty here */}
                                            </div>
                                        )
                                    })}
                                </div>
                              </div>
                          </div>
                      )
                  })}
                  </div>
               </div>
            </div>

            {/* Bottom buttons: Back and Send */}
            {!isSellerReadOnly && !isConfirmed && (
            <div className="flex justify-end items-center mt-6 shrink-0">
                <button
                    onClick={handleFinalSubmit}
                    disabled={selectedSlots.size === 0}
                    className={`px-8 py-2.5 rounded-full font-semibold text-md transition-colors ${
                        selectedSlots.size > 0
                            ? "bg-green-dark text-white hover:bg-opacity-90 cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {isBuyer ? "Confirm" : "Send"}
                </button>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePickupModal;