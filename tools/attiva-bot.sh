#!/usr/bin/env bash
# Attiva il ponte Telegram: controlla le richieste ogni 5 minuti.
# Uso:  bash tools/attiva-bot.sh
set -euo pipefail
CONF="$HOME/.config/heels-bot"
SCRIPT="$(cd "$(dirname "$0")" && pwd)/bot.py"
for f in token gemini-key; do
  [ -f "$CONF/$f" ] || { echo "Manca $CONF/$f"; exit 1; }
done
[ -f "$CONF/mio-chat-id" ] || { echo "Prima registra l'amministratore: scrivi al bot, poi lancia"; echo "  python3 $SCRIPT --registra"; exit 1; }
RIGA="*/5 * * * * cd $(dirname "$(dirname "$SCRIPT")") && /usr/bin/python3 $SCRIPT --ciclo >> $CONF/bot.log 2>&1"
if crontab -l 2>/dev/null | grep -Fq "bot.py --ciclo"; then
  echo "Il ponte era già attivo."
else
  (crontab -l 2>/dev/null; echo "$RIGA") | crontab -
  echo "Ponte attivato: controlla le richieste ogni 5 minuti."
fi
echo "Per fermarlo:  crontab -e  e cancella la riga che contiene bot.py"
