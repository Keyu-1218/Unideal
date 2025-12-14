import Icon from "@/components/Icon";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/custom-datepicker.css";
import { MultiSelect } from "@/components/Multiselect";
import { formatCalendarDate } from "@/helpers/formatCalendarDate";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";

const FilterHomePage = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [distance, setDistance] = useState(3);
  const [locations, setLocations] = useState<string[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [advancedLocation, setAdvancedLocation] = useState("");

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

  const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistance(Number(e.target.value));
  };

  const handleAdvancedLocationChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setAdvancedLocation(value);

    const params = new URLSearchParams(window.location.search);
    if (value.trim()) {
      params.set("preciseLocation", value);
    } else {
      params.delete("preciseLocation");
    }
    setSearchParams(params);
  };

  const toggleAdvancedSection = () => {
    setIsAdvancedOpen((prev) => !prev);
  };

  const hasAdvancedLocation = advancedLocation.trim().length > 0;

  const handleLocationChange = (newLocations: string[]) => {
    setLocations(newLocations);

    if (newLocations.length > 0) {
      searchParams.set("location", newLocations.join(","));
    } else {
      searchParams.delete("location");
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const availableFrom = searchParams.get("available_from");

    if (!availableFrom) {
      const today = new Date();
      setStartDate(today);
      setLocations([]);
      setDistance(3);

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("available_from", formattedDate);
        newParams.set("available_to", formattedDate);
        return newParams;
      }, { replace: true });
    } else {
      const dateFromUrl = new Date(availableFrom);
      if (!isNaN(dateFromUrl.getTime())) {
        setStartDate((prev) => {
          if (!prev || prev.toDateString() !== dateFromUrl.toDateString()) {
            return dateFromUrl;
          }
          return prev;
        });
      }
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (hasAdvancedLocation) {
      updateDistanceInURL(distance);
    } else {
      updateDistanceInURL(undefined);
    }
  }, [hasAdvancedLocation, distance, updateDistanceInURL]);

  useEffect(() => {
    return () => {
      updateDistanceInURL.cancel();
    };
  }, [updateDistanceInURL]);

  const calendarValue = useMemo(() => {
    if (!startDate) {
      return "";
    }
    return formatCalendarDate(startDate, startDate);
  }, [startDate]);

  return (
    <div className="flex flex-col gap-8 max-w-[394px] bg-background-light rounded-[8px] pt-5 pr-3.5 pl-4 pb-9">
      {/* --- Pick-up Date --- */}
      <div className="flex gap-4 items-center">
        <Icon name="calendar" size={26} />
        <span className="flex-1">Pick-up Date</span>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          placeholderText="mm/dd/yyyy"
          value={calendarValue}
          customInput={
            <Input className="w-[200px] h-7 text-center text-xs text-black placeholder-[#719781] bg-[#EBEBEB] rounded-md px-2 py-1 border border-transparent" />
          }
        />
      </div>

      {/* --- City --- */}
      <div className="flex gap-4 items-center">
        <Icon name="location" size={21} />
        <span className="flex-1">City</span>
        <MultiSelect onChange={handleLocationChange} locations={locations} />
      </div>

      {/* --- Advanced toggle --- */}
      <button
        type="button"
        onClick={toggleAdvancedSection}
        className="flex items-center gap-2 pl-[46px] text-green-dark text-sm font-semibold"
      >
        Advanced Location Setting
        <span
          className={`transition-transform duration-200 ${
            isAdvancedOpen ? "" : "rotate-180"
          }`}
        >
          <Icon name="toggle" size={16} />
        </span>
      </button>

      {isAdvancedOpen && (
        <div className="flex flex-col gap-6">
          {/* --- Advanced Location --- */}
          <div className="flex gap-4 items-center">
            <Icon name="location" size={21} />
            <span className="flex-1">Location</span>
            <Input
              className="w-[200px] h-7 text-xs text-black placeholder-[#719781] bg-[#EBEBEB] rounded-md px-2 py-1 border border-transparent"
              value={advancedLocation}
              onChange={handleAdvancedLocationChange}
              placeholder="Enter pick-up location"
            />
          </div>

          {/* --- Distance --- */}
          <div
            className={`transition-opacity duration-200 ${
              hasAdvancedLocation
                ? "opacity-100"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <div className="flex gap-4 items-center mb-2">
              <Icon name="distance" size={30} />
              <span className="flex-1">Distance</span>
              <span className="w-[200px] text-right text-green-light font-bold">
                {distance}km
              </span>
            </div>
            <div className="pl-[46px]">
              <input
                type="range"
                disabled={!hasAdvancedLocation}
                min="1"
                max="500"
                value={distance}
                onChange={handleDistanceChange}
                className="range-slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterHomePage;
