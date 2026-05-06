import sqlite3
import asyncio
from telethon import TelegramClient
from datetime import datetime

API_ID = '你的API_ID'
API_HASH = '你的API_HASH'

db = sqlite3.connect('database.sqlite')
cursor = db.cursor()
cursor.execute("SELECT phone_number FROM tg_accounts")
accounts = cursor.fetchall()

async def keep_alive(phone):
    client = TelegramClient(f'sessions/{phone}.session', API_ID, API_HASH)
    await client.start(phone)
    me = await client.get_me()
    print(f"{phone} 保号成功")
    await client.disconnect()
    cursor.execute("UPDATE tg_accounts SET status=?, last_active=? WHERE phone_number=?",
                   ('active', datetime.now().strftime("%Y-%m-%d %H:%M:%S"), phone))
    db.commit()

async def main():
    tasks = [keep_alive(phone[0]) for phone in accounts]
    await asyncio.gather(*tasks)

asyncio.run(main())
