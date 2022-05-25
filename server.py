from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi_utils.tasks import repeat_every

from build import checkout, minify

app = FastAPI()

app.mount("/17aa5afb9bce4072cb3f65ed67bf3e3e93f244d768de08b23a46fd6c3b8bf6033f230d746535125d8de77d5342", StaticFiles(directory="website/demo"), name="metarack_demo")
app.mount("/", StaticFiles(directory="website/landing", html=True), name="landing")

@app.on_event("startup")
def init_website_files():
    checkout()
    minify()

@app.on_event("startup")
@repeat_every(seconds=10)
def check_updates_task():
    if checkout():
        minify()
