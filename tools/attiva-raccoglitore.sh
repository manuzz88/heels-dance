#!/usr/bin/env bash
# Attiva il raccoglitore automatico delle richieste Telegram: gira ogni ora,
# archivia i messaggi e li inoltra a Manuel. Non usa Claude, non consuma crediti.
# Uso:  bash tools/attiva-raccoglitore.sh
set -euo pipefail
CONF="$HOME/.config/heels-bot"
SCRIPT="$(cd "$(dirname "$0")" && pwd)/leggi-richieste.py"
if [ ! -f "$CONF/token" ]; then
  echo "Manca il token. Crealo prima con:"
  echo "  echo 'IL_TUO_TOKEN' > $CONF/token"
  exit 1
fi
RIGA="0 * * * * /usr/bin/python3 $SCRIPT --raccogli >> $CONF/raccoglitore.log 2>&1"
if crontab -l 2>/dev/null | grep -Fq "$SCRIPT --raccogli"; then
  echo "Il raccoglitore era già attivo."
else
  (crontab -l 2>/dev/null; echo "$RIGA") | crontab -
  echo "Raccoglitore attivato: controlla ogni ora."
fi
echo "Per disattivarlo:  crontab -e  e cancella la riga che contiene leggi-richieste.py"
