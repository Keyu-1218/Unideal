import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, AlertCircle } from "lucide-react";
import DurationDisplay from "@/containers/DurationDisplay";
import { useAddProduct } from "@/contexts/add-product/useAddProduct";

const DatesStep = () => {
  const { data, updateData, errors, clearFieldError } = useAddProduct();
  const [startDate, setStartDate] = useState<Date | null>(
    data.availableDates.startDate
  );
  const [endDate, setEndDate] = useState<Date | null>(
    data.availableDates.endDate
  );

  // Помилки для дат
  const startDateError = errors["availableDates.startDate"];
  const endDateError = errors["availableDates.endDate"];
  const hasError = startDateError || endDateError;

  const handleDateChange = (
    dates: [Date | null, Date | null] | Date | null
  ) => {
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);

      if (start && startDateError) {
        clearFieldError("availableDates.startDate");
      }
      if (end && endDateError) {
        clearFieldError("availableDates.endDate");
      }
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    updateData("availableDates", { startDate, endDate });
  }, [startDate, endDate, updateData]);

  return (
    <div className="w-[clamp(520px,56vw,680px)] mx-auto">
      <div className="mb-1">
        <h2 className="text-[30px] font-bold text-center">
          Available pick up dates
        </h2>
        <p className="text-[18px] text-text-gray text-center mt-1">
          Select available pickup dates.
        </p>
      </div>

      {hasError && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-500 rounded-md animate-slideDown">
          <div className="flex items-start gap-2">
            <AlertCircle
              className="text-red-500 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex flex-col gap-1">
              {startDateError && (
                <p className="text-red-600 text-sm font-medium">{startDateError}</p>
              )}
              {endDateError && (
                <p className="text-red-600 text-sm font-medium">{endDateError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div
        className={`bg-white rounded-xl shadow-lg p-6 mb-8 transition-all flex justify-center ${
          hasError ? "border-2 border-red-500" : ""
        }`}
      >
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={new Date()}
          monthsShown={2}
          calendarClassName="custom-calendar"
        />
      </div>

      {/* Selected Dates Display */}
      {(startDate || endDate) && (
        <div
          className={`w-full rounded-lg p-4 border transition-colors ${
            hasError
              ? "bg-red-50 border-red-500"
              : "bg-background-gray border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar
              className={hasError ? "text-red-500" : "text-green-dark"}
              size={24}
            />
            <h3 className="text-md font-semibold">Selected Period</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div
              className={`bg-white rounded-lg p-4 border-2 ${
                startDateError ? "border-red-500" : "border-gray-200"
              }`}
            >
              <p className="text-sm text-text-gray mb-1">Pick up date stars on</p>
              <p
                className={`text-md font-bold ${
                  startDateError ? "text-red-500" : "text-green-dark"
                }`}
              >
                {startDate ? formatDate(startDate) : "Not selected"}
              </p>
            </div>

            {/* End Date */}
            <div
              className={`bg-white rounded-lg p-4 border-2 ${
                endDateError ? "border-red-500" : "border-gray-200"
              }`}
            >
              <p className="text-sm text-text-gray mb-1">Pick up date ends on</p>
              <p
                className={`text-md font-bold ${
                  endDateError ? "text-red-500" : "text-green-dark"
                }`}
              >
                {endDate ? formatDate(endDate) : "Not selected"}
              </p>
            </div>
          </div>

          {/* Duration */}
          {startDate && endDate && !hasError && (
            <DurationDisplay startDate={startDate} endDate={endDate} />
          )}
        </div>
      )}

      {!startDate && !endDate && (
        <div className="w-full bg-gray-50 rounded-lg p-6 text-center">
          <Calendar className="mx-auto text-gray-400 mb-2" size={40} />
          <p className="text-gray-500 text-base">
            Select dates on the calendar above
          </p>
        </div>
      )}
    </div>
  );
};

export default DatesStep;
