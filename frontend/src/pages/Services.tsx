import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serviceBookingService } from "@/services/serviceBookingService";
import { farmService } from "@/services/farmService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [farms, setFarms] = useState<any[]>([]);

  const [bookingState, setBookingState] = useState<{
    [key: number]: {
      farmId?: string;
      date?: Date;
    };
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    setServices([
      { id: 1, name: "Drone Mapping", key: "DroneMapping", price: 5000 },
      { id: 2, name: "Soil Testing", key: "SoilTesting", price: 1500 },
      { id: 3, name: "Crop Health Scan", key: "CropHealthScan", price: 3000 }
    ]);

    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await farmService.getAllFarms();

      const farmList =
        response?.farms ||
        response?.data?.farms ||
        response?.data ||
        [];

      setFarms(farmList);
    } catch (error) {
      console.error("Failed to fetch farms", error);
    }
  };

  const handleFarmChange = (serviceId: number, farmId: string) => {
    setBookingState((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        farmId
      }
    }));
  };

  const handleDateChange = (serviceId: number, date?: Date) => {
    setBookingState((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        date
      }
    }));
  };

  //   const user = JSON.parse(localStorage.getItem("user") || "null");
  //   const userId = user?.id;

  const handleBookService = async (service: any) => {
    const booking = bookingState[service.id];

    if (!booking?.farmId) {
      toast.error("Please select a farm");
      return;
    }

    if (!booking?.date) {
      toast.error("Please select a date");
      return;
    }
    try {
      await serviceBookingService.createBooking({
        farm_id: booking.farmId,
        service_type: service.key,
        booking_date: booking.date.toISOString().split("T")[0]
      });

      toast.success("Service booked successfully!");

      // Clear only that card
      setBookingState((prev) => ({
        ...prev,
        [service.id]: {}
      }));

    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Booking failed.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Services</h1>

          <Button
            variant="outline"
            onClick={() => navigate("/my-bookings")}
          >
            View My Bookings
          </Button>
        </div>

        <p className="text-gray-500">
          Book agricultural services for your farm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const booking = bookingState[service.id] || {};

            return (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">
                    ₹{service.price}
                  </div>

                  {/* FARM SELECT */}
                  <Select
                    value={booking.farmId || ""}
                    onValueChange={(value) =>
                      handleFarmChange(service.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Farm" />
                    </SelectTrigger>
                    <SelectContent>
                      {farms.map((farm) => (
                        <SelectItem key={farm.id} value={farm.id}>
                          {farm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* DATE PICKER */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !booking.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {booking.date
                          ? format(booking.date, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={booking.date}
                        onSelect={(date) =>
                          handleDateChange(service.id, date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* BOOK BUTTON */}
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleBookService(service)
                    }
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}