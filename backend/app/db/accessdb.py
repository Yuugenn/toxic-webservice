import psycopg2

con = psycopg2.connect(
    host="localhost",
    user="postgres",
    password="password",
    database="toxicwebservice")


def addTox(smiles, code, label):
    cur = con.cursor()
    cur.execute('insert into tox_table (id, smiles, code, label) values (%s, %s, %s, %s)',(9002, smiles, code, label))
    con.commit()
    cur.close()
    con.close()


def getTox(input_id):
    cur = con.cursor()
    cur.execute('select * from tox_table where id = %s', [input_id])

    rows = cur.fetchall()

    for r in rows:
        print(f"id: {r[0]}")
        print(f"smiles: {r[1]}")
        print(f"code: {r[2]}")
        print(f"label: {r[3]}")

    cur.close()
    con.close()
