import os
import uvicorn
import datetime 
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi_utils.tasks import repeat_every
from fastapi.responses import RedirectResponse

hostname = os.getenv('DOMAIN')

app = FastAPI(docs_url=None, redoc_url=None)

app.mount("/17aa5afb9bce4072cb3f65ed67bf3e3e93f244d768de08b23a46fd6c3b8bf6033f230d746535125d8de77d5342", StaticFiles(directory="website/demo"), name="metarack_demo")
app.mount("/static", StaticFiles(directory="website/landing", html=True), name="landing")

@app.get('/')
def index():
  return RedirectResponse(f"https://{hostname}/static/index.html")

@app.get("/request")
async def read_item(userdesc: str = '', useremail: str = ''):
    now = datetime.datetime.now()
    with open("private/applications.txt", "a+") as f:
        f.write(f"{now.strftime('%Y-%m-%d %H:%M:%S')},{userdesc},{useremail}\n")
    return RedirectResponse(f"https://{hostname}/static/request_success.html")

if __name__ == "__main__":
    uvicorn.run("main_app:app", host='0.0.0.0', port=1337, reload=True,
                ssl_keyfile='private/metarack_nopass.pem', ssl_certfile='private/metarack_art.crt')
