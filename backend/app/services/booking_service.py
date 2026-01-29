from fastapi import BackgroundTasks

def send_booking_email(email: str):
    ...

@router.post("/bookings")
def create_booking(
    booking: BookingCreate,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(send_booking_email, user.email)
