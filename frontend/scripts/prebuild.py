import datetime
from pathlib import Path

build_time_path = Path(__file__).parent / ".." / "src" / "build-time.ts"

build_time = datetime.datetime.now(tz=datetime.UTC)

output = f"""
export const BUILD_TIME = "{build_time.isoformat()}";
"""

build_time_path.write_text(output)
