from datetime import datetime, timedelta, timezone

def get_expiry(type: str = "days", value: int = 7) -> str:
    if type.lower().strip() == "days":
        return datetime.now(timezone.utc) + timedelta(days=value)
    elif type.lower().strip() == "minutes":
        return datetime.now(timezone.utc) + timedelta(minutes=value)
    else:
        raise ValueError("Invalid type. Must be 'days' or 'minutes'.")
