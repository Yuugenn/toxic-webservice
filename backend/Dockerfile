  
FROM continuumio/miniconda3

RUN mkdir /app
WORKDIR /app

RUN apt update && \
    apt install -y postgresql-client

COPY environment.yml .
RUN conda env create -f environment.yml

SHELL ["conda", "run", "-n", "myenv", "/bin/bash", "-c"]
RUN echo "WOW"
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]

COPY . .
ENTRYPOINT ["conda", "run", "-n", "myenv", "/bin/bash", "-c"]
