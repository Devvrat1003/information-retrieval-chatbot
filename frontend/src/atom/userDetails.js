import { atom } from "recoil";

export const userDetailsState = atom({
    key: "userDetailsState", // Unique ID for the atom
    default: {
        CheckInDate: "",
        CheckOutDate: "",
        NumGuests: 0,
        GuestName: "",
        Email: "",
        PhoneNumber: "",
        RoomType: "Standard Room",
        NumRooms: 0,
    },
});
