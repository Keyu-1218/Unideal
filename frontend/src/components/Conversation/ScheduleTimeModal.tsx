import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// 引入 date-fns 用于处理日期加减和格式化
import { addDays, format, isSameDay, setHours, setMinutes } from "date-fns";

// ----------------------
// 类型定义
// ----------------------
interface ScheduleTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  //最终提交的数据：包含选中的日期，以及每个日期下具体的有空时间段
  onSubmit: (availability: { date: Date; slots: string[] }[]) => void;
}

const SchedulePickupModal: React.FC<ScheduleTimeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // --- 状态管理 ---
  const [step, setStep] = useState<1 | 2>(1); // 1: 选日期范围, 2: 选具体时间格
  
  // Step 1 States
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  // Step 2 States: 记录选中的具体时间块 (格式: "YYYY-MM-DD_HH:mm")
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  // Step 2 Dragging States
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ dateKey: string; time: string } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ dateKey: string; time: string } | null>(null);
  const [dragAction, setDragAction] = useState<"select" | "deselect">("select");

  // --- 初始化与重置 ---
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedDates([]);
      setSelectedSlots(new Set());
    }
  }, [isOpen]);

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

  // --- Step 1 逻辑: 处理日期多选 ---
  const handleDateSelect = (date: Date) => {
    const exists = selectedDates.find((d) => isSameDay(d, date));
    if (exists) {
      // 如果已选，则取消选择
      setSelectedDates(selectedDates.filter((d) => !isSameDay(d, date)));
    } else {
      // 如果没选，则添加
      setSelectedDates([...selectedDates, date].sort((a, b) => a.getTime() - b.getTime()));
    }
  };

  // 生成下拉菜单的时间选项 (00:00 - 23:00)
  const timeOptions = Array.from({ length: 24 }).map((_, i) => {
    const hour = i;
    const label = hour === 0 ? "12:00 AM" : hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;
    const value = `${hour.toString().padStart(2, "0")}:00`;
    return { value, label };
  });

  // --- Step 2 逻辑: 生成时间网格 ---
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
    // 添加最后的结束整点 (如果需要包含结束点本身，通常时间段是左闭右开，这里假设显示到结束前)
    // 为了UI显示效果，我们通常显示 slot 开始时间
    return slots;
  };

  // 生成时间轴标签 (包含结束时间，用于对齐网格线)
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
    const key = `${dateKey}_${time}`;
    const isSelected = selectedSlots.has(key);
    
    setIsDragging(true);
    setDragStart({ dateKey, time });
    setDragCurrent({ dateKey, time });
    setDragAction(isSelected ? "deselect" : "select");
  };

  const handleMouseEnter = (dateKey: string, time: string) => {
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

  // 格式化显示时间 (09:00 -> 9:00 AM)
  const formatTimeDisplay = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    const date = setMinutes(setHours(new Date(), h), m);
    return format(date, "h:mm aa");
  };

  // --- 提交逻辑 ---
  const handleFinalSubmit = () => {
    // 将 Set 转回结构化数据
    const result = selectedDates.map(date => {
        const dateKey = format(date, "yyyy-MM-dd");
        // 找出该日期下所有被选中的 slot
        const slotsForDate = Array.from(selectedSlots)
            .filter(key => key.startsWith(dateKey))
            .map(key => key.split("_")[1]); // 取出 HH:mm
        return { date, slots: slotsForDate };
    }).filter(item => item.slots.length > 0); // 过滤掉没选时间的日期

    onSubmit(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-8">
      <div className={`bg-[#F3F6F4] ${
          step === 1 ? "w-[700px]" : "w-fit min-w-[500px] max-w-[90vw] h-[80vh]"
        } max-h-full min-h-[400px] rounded-2xl px-8 pt-8 pb-6 relative shadow-xl flex flex-col transition-all`}>
        
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="absolute top-7 left-8 text-gray-500 hover:text-gray-700 font-medium z-10 flex items-center gap-1"
          >
            &larr; Back
          </button>
        )}

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
        >
          &times;
        </button>

        {/* ================= STEP 1: 选择日期和范围 ================= */}
        {step === 1 && (
          <div className="flex flex-col h-full pt-2">
            <div className="flex flex-row gap-6 flex-1">
              
              {/* 左侧: 日历 */}
              <div className="w-1/2 flex flex-col items-center border-r border-gray-200 pr-4 pt-4">
                <h3 className="text-md font-semibold text-green-dark mb-4 text-center">
                  What dates might work in 1 week?
                </h3>
                
                {/* 自定义样式的 DatePicker */}
                <style>{`
                  .react-datepicker { border: none; background: transparent; font-family: inherit; }
                  .react-datepicker__header { background: transparent; border-bottom: none; }
                  .react-datepicker__day-name { color: #666; width: 1.7rem; }
                  .react-datepicker__day { width: 1.7rem; line-height: 1.7rem; margin: 0.1rem; border-radius: 50%; }
                  /* 强制 hover 状态也保持圆形 */
                  .react-datepicker__day:hover {
                    border-radius: 50% !important;
                  }

                  /* 1. 强力清除键盘选中/聚焦时的默认背景 (针对未选中的日期) */
                  .react-datepicker__day--keyboard-selected:not(.react-datepicker__day--highlighted) { 
                    background-color: transparent !important; 
                    color: inherit !important; 
                    border: none !important;
                    outline: none !important;
                  }

                  /* 2. 选中日期的样式 - 深绿色 */
                  .react-datepicker__day--highlighted { 
                    background-color: var(--color-green-dark) !important; 
                    color: white !important; 
                    border-radius: 50%;
                  }
                  
                  /* 3. 确保聚焦+选中状态也是深绿色 */
                  .react-datepicker__day--highlighted:hover,
                  .react-datepicker__day--highlighted:focus,
                  .react-datepicker__day--highlighted.react-datepicker__day--keyboard-selected {
                    background-color: var(--color-green-dark) !important;
                    color: white !important;
                  }

                  .react-datepicker__day--today { font-weight: bold; }
                  
                  /* 禁用日期 (不可选) 的样式：Hover 时不改变背景色和字体颜色 */
                  .react-datepicker__day--disabled {
                    color: #ccc !important;
                  }
                  .react-datepicker__day--disabled:hover {
                    background-color: transparent !important;
                    color: #ccc !important;
                    cursor: default;
                  }

                  /* 自定义下拉框箭头样式 */
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
                  selected={null} // 不使用默认的单选 selected
                  onChange={handleDateSelect}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 6)} // 限制只能选未来7天
                  highlightDates={selectedDates} // 关键：用高亮来显示“多选”
                  dayClassName={(date) => 
                     selectedDates.find(d => isSameDay(d, date)) ? "font-bold" : ""
                  }
                />
              </div>

              {/* 右侧: 时间范围 */}
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

                  {/* Next 按钮 */}
                 
                  </div>

                  <div className="flex justify-end pt-10">
                    <button
                      onClick={() => setStep(2)}
                      disabled={selectedDates.length === 0} // 必须选至少一个日期
                      className={`px-8 py-2.5 rounded-full font-semibold text-md transition-colors ${
                        selectedDates.length > 0
                          ? "bg-green-dark text-white hover:bg-opacity-90 cursor-pointer" // 绿色激活
                          : "bg-gray-300 text-gray-500 cursor-not-allowed" // 灰色禁用
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
               Your Availability
            </h2>
            
            {/* 时间网格容器 */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto border border-gray-200 rounded-xl bg-white p-4">
               <div className="flex flex-row w-fit mx-auto">
                  {/* --- 新增: 左侧时间轴 --- */}
                  <div className="flex flex-col min-w-[70px] sticky left-0 bg-white z-10 border-r border-gray-100 mr-4">
                      {/* 占位 Header (与右侧日期 Header 高度一致，确保下方对齐) */}
                      <div className="mb-4 text-center opacity-0 pointer-events-none">
                          <div className="text-sm uppercase">MMM D</div>
                          <div className="text-lg font-bold">EEE</div>
                      </div>
                      {/* 时间标签列表 (pt-[1px] 用于补偿右侧容器的 border 宽度) */}
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

                  {/* --- 右侧: 日期列 --- */}
                  <div className="flex flex-row gap-4 flex-1">
                  {/* 针对每一个选中的日期，渲染一列 */}
                  {selectedDates.map((date, index) => {
                      const timeSlots = generateTimeSlots();
                      return (
                          <div key={index} className="flex flex-col items-center min-w-[100px]">
                              {/* 列头: 日期 */}
                              <div className="mb-4 text-center">
                                  <div className="text-gray-500 text-sm uppercase">{format(date, "MMM d")}</div>
                                  <div className="text-green-dark font-bold text-lg">{format(date, "EEE")}</div>
                              </div>
                              
                              {/* 时间块列表 */}
                              <div className="flex flex-col gap-2 w-full">
                                <div className="flex flex-col w-full bg-[#E9F1EB] rounded-lg overflow-hidden border border-gray-300 select-none">
                                    {timeSlots.map((time, idx) => {
                                        const dateKey = format(date, "yyyy-MM-dd");
                                        const isSelected = isSlotSelected(dateKey, time);
                                        const isHourMark = time.endsWith(":30"); // If slot is 09:30, bottom border is 10:00 (Hour mark)
                                        const isLast = idx === timeSlots.length - 1;

                                        return (
                                            <div
                                                key={time}
                                                onMouseDown={() => handleMouseDown(dateKey, time)}
                                                onMouseEnter={() => handleMouseEnter(dateKey, time)}
                                                className={`w-full h-8 flex items-center justify-center text-xs font-medium cursor-pointer transition-colors ${
                                                    isSelected
                                                      ? "bg-[#8EB59B] text-white" // 选中: 深一点的绿色
                                                      : "hover:bg-[#D4E2D8] text-gray-600" // 未选中: 浅绿背景 + hover
                                                } ${
                                                    !isLast ? (isHourMark ? "border-b border-gray-500" : "border-b border-gray-300") : ""
                                                }`}
                                            >
                                                {/* 时间文字已移至左侧轴，此处留空 */}
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

            {/* 底部按钮: Back 和 Send */}
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
                    Send
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePickupModal;