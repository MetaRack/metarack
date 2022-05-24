from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/17aa5afb9bce4072cb3f65ed67bf3e3e93f244d768de08b23a46fd6c3b8bf6033f230d746535125d8de77d5342", StaticFiles(directory="website"), name="metarack")
app.mount("/", StaticFiles(directory="resources"), name="resources")
