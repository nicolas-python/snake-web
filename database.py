import sqlite3

def init_db():
    conn = sqlite3.connect("snake.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        score INTEGER DEFAULT 0,
        time INTEGER DEFAULT 0
    )
                   """)

    conn.commit()
    conn.close()

def get_players():
    conn = sqlite3.connect("snake.db")
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM players")
    players = cursor.fetchall()

    conn.close()

    return players

def save_player(name):
    conn = sqlite3.connect("snake.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT OR IGNORE INTO players (name, score, time)
    VALUES (?, 0, 0)
    """, (name,))

    conn.commit()
    conn.close()

def delete_player(name):
    conn = sqlite3.connect("snake.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM players WHERE name = ?", (name,))

    conn.commit()
    conn.close()

def get_scores():
    conn = sqlite3.connect("snake.db")
    cursor = conn.cursor()

    cursor.execute("SELECT name, score, time FROM players ORDER BY score DESC")
    scores = cursor.fetchall()

    conn.close()
    return scores

def save_score(name, score):
    conn = sqlite3.connect("snake.db")
    cursor = conn.cursor()

    # Prüfen ob Spieler schon existiert
    cursor.execute("SELECT score FROM players WHERE name = ?", (name,))
    result = cursor.fetchone()

    if result is None:
        # Spieler neu → einfügen
        cursor.execute(
            "INSERT INTO players (name, score, time) VALUES (?, ?, 0)",
            (name, score)
        )
    else:
        best_score = result[0]

        # nur updaten wenn besser
        if score > best_score:
            cursor.execute(
                "UPDATE players SET score = ? WHERE name = ?",
                (score, name)
            )

    conn.commit()
    conn.close()

def get_highscores():
    conn = sqlite3.connect("snake.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name, MAX(score) as score, MAX(time)
        FROM players
        GROUP BY name
        ORDER BY score DESC
        LIMIT 3
    """)

    highscores = cursor.fetchall()

    conn.close()
    return highscores

