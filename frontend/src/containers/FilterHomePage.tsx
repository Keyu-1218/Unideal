import Icon from "@/components/Icon";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/custom-datepicker.css";
import { formatCalendarDate } from "@/helpers/formatCalendarDate";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";

const FilterHomePage = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [locationText, setLocationText] = useState("");
  const [haveCar, setHaveCar] = useState(false);
  const [travelTime, setTravelTime] = useState<"none" | "15" | "30" | "45" | "60">("none");

  const [searchParams, setSearchParams] = useSearchParams();

  const updateDistanceInURL = useMemo(
    () =>
      debounce((value?: number) => {
        setSearchParams((prev) => {
          const params = new URLSearchParams(prev);
          if (typeof value === "number") {
            params.set("travelDistance", value.toString());
          } else {
            params.delete("travelDistance");
          }
          return params;
        });
      }, 400),
    [setSearchParams]
  );

  const updateLocationInURL = useMemo(
    () =>
      debounce((value: string) => {
        setSearchParams((prev) => {
          const params = new URLSearchParams(prev);
          if (value.trim()) {
            params.set("location", value.trim());
          } else {
            params.delete("location");
            params.delete("travelDistance");
          }
          return params;
        });
      }, 500),
    [setSearchParams]
  );

  const handleDateChange = (
    date: Date | null
  ) => {
    setStartDate(date);

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (date) {
        // Use local time to avoid timezone issues (e.g. UTC showing yesterday)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        
        newParams.set("available_from", formattedDate);
        newParams.set("available_to", formattedDate);
      } else {
        newParams.delete("available_from");
        newParams.delete("available_to");
      }
      return newParams;
    });
  };

  const handleLocationInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationText(value);
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateLocationInURL(locationText);
    }
  };

  const toggleHaveCar = () => {
    setHaveCar((prev) => {
      const next = !prev;
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams);
        if (next) params.set("haveCar", "true");
        else params.delete("haveCar");
        return params;
      });
      return next;
    });
  };

  const handleTravelTimeChange = (value: "none" | "15" | "30" | "45" | "60") => {
    setTravelTime(value);
    if (!locationText.trim()) return;
    if (value === "none") {
      updateDistanceInURL(undefined);
      return;
    }
    // Map time to minutes for filtering
    const map: Record<string, number> = { "15": 15, "30": 30, "45": 45, "60": 60 };
    const minutes = map[value];
    updateDistanceInURL(minutes);
  };

  // Removed mount-time URL initialization to avoid first heavy refresh

  // Sync URL params to component state when user navigates with browser back/forward
  useEffect(() => {
    const urlLocation = searchParams.get("location") || "";
    const urlHaveCar = searchParams.get("haveCar") === "true";
    const urlTravelDistance = searchParams.get("travelDistance");
    const urlDate = searchParams.get("available_from");

    // Only update if different from current state (avoid unnecessary renders)
    if (urlLocation !== locationText) {
      setLocationText(urlLocation);
    }
    if (urlHaveCar !== haveCar) {
      setHaveCar(urlHaveCar);
    }
    if (urlDate) {
      const dateFromUrl = new Date(urlDate);
      if (!isNaN(dateFromUrl.getTime())) {
        setStartDate((prev) => {
          if (!prev || prev.toDateString() !== dateFromUrl.toDateString()) {
            return dateFromUrl;
          }
          return prev;
        });
      }
    }
    if (urlTravelDistance) {
      const mapRev: Record<number, "15" | "30" | "45" | "60"> = {
        15: "15",
        30: "30",
        45: "45",
        60: "60",
      } as any;
      const v = Number(urlTravelDistance);
      setTravelTime(mapRev[v] || "15");
    } else {
      setTravelTime("none");
    }
  }, [searchParams]);

  useEffect(() => {
    return () => {
      updateDistanceInURL.cancel();
      updateLocationInURL.cancel();
    };
  }, [updateDistanceInURL, updateLocationInURL]);

  const calendarValue = useMemo(() => {
    if (!startDate) {
      return "";
    }
    return formatCalendarDate(startDate, startDate);
  }, [startDate]);

  const isLocationFilled = locationText.trim().length > 0;

  return (
    <div className="flex flex-col gap-8 w-[290px] bg-background-light rounded-[10px] py-8 px-6">
      {/* Pick-up Date */}
      <div className="flex gap-4 items-center">
        <Icon name="calendar" size={24} />
        <span className="flex-1 text-sm ">Pickup Date</span>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          placeholderText="mm/dd/yyyy"
          value={calendarValue}
          customInput={
            <Input className="!w-[100px] h-7 text-center !text-xs font-semibold text-green-dark placeholder-[#719781] bg-white rounded-full !-px-5 py-1.5 border border-transparent" />
          }
        />
      </div>

      {/* Your Location */}
      <div className="flex gap-4 items-center pl-1.5">
        <Icon name="location" size={14} />
        <span className="flex-1 text-sm">Your Location</span>
        <Input
          className="w-[100px] h-7 text-xs text-green-dark font-normal text-center placeholder-[#C7CFCA] placeholder:text-[11px] bg-white rounded-full px-4 py-1 pb-1.5 border border-transparent"
          value={locationText}
          onChange={handleLocationInput}
          onKeyDown={handleLocationKeyDown}
          placeholder="Type: aalto"
        />
      </div>

      {/* Have Cars? */}
      <div className={`flex gap-4 items-center pl-1 ${isLocationFilled ? "" : "opacity-50 pointer-events-none"}`}>
        <Icon name="car" size={20} />
        <span className="flex-1 text-sm">Have Cars?</span>
        <button
          type="button"
          onClick={toggleHaveCar}
          className={`relative w-[68px] h-7 rounded-full transition-all duration-400 ease-in-out ${haveCar ? "bg-green-dark" : "bg-[#EBEBEB]"}`}
        >
          <span
            className={`absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full shadow-sm transition-all duration-400 ease-in-out ${haveCar ? "left-[44px] bg-white" : "left-1 bg-[#D9D9D9]"}`}
          ></span>
          <span className={`absolute inset-0 flex items-center text-xs font-semibold transition-opacity duration-400 ${haveCar ? "justify-start pl-3.5 text-white" : "justify-end pr-4 text-[#5E836C]"}`}>
            {haveCar ? "YES" : "NO"}
          </span>
        </button>
      </div>

      {/* Travel Time within */}
      <div className={`flex gap-4 items-center pl-1 ${isLocationFilled ? "" : "opacity-50 pointer-events-none"}`}>
        <Icon name="travel" size={20} />
        <span className="flex-1 text-sm">Time Within</span>
        <div className="relative">
          <select
            value={travelTime}
            onChange={(e) => handleTravelTimeChange(e.target.value as any)}
            disabled={!isLocationFilled}
            className="appearance-none w-[100px] h-7 pl-3 pr-6 text-center text-xs font-semibold text-green-dark bg-white rounded-full border border-transparent cursor-pointer"
          >
            <option value="none">No limit</option>
            <option value="15">15min</option>
            <option value="30">30min</option>
            <option value="45">45min</option>
            <option value="60">1h</option>
          </select>
          <Icon
            name="toggle"
            size={8}
            className="rotate-180 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-green-light"
          />
          
        </div>
      </div>
    </div>
  );
};

export default FilterHomePage;
