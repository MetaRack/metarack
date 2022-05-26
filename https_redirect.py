import uvicorn
from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import RedirectResponse

app = FastAPI(docs_url=None, redoc_url=None)

@app.route('/{_:path}')
async def https_redirect(request: Request):
    return RedirectResponse(request.url.replace(scheme='https'))

if __name__ == '__main__':
    uvicorn.run('https_redirect:app', host='0.0.0.0', port=8080, reload=True)