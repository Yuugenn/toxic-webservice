  
FROM continuumio/miniconda3

RUN mkdir /app
WORKDIR /app

COPY environment.yml .
RUN conda env create -f environment.yml

SHELL ["conda", "run", "-n", "toxenv", "/bin/bash", "-c"]

COPY . .

ENTRYPOINT ["conda", "run", "-n", "toxenv"]
