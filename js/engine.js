let balance = 10000;
let price = 30000;
let trades = [];
let tradeId = 1;

function tick() {
  price += (Math.random() - 0.5) * 50;
  updateTrades();
}
setInterval(tick, 1000);

function openTrade(type) {
  const lot = parseFloat(document.getElementById('lot').value);
  const sl = parseFloat(document.getElementById('sl').value);
  const tp = parseFloat(document.getElementById('tp').value);

  trades.push({
    id: tradeId++,
    type,
    entry: price,
    lot,
    sl,
    tp,
    pnl: 0
  });
}

function updateTrades() {
  let floating = 0;
  const tbody = document.querySelector('#trades tbody');
  tbody.innerHTML = '';

  trades = trades.filter(t => {
    const diff = (price - t.entry) * (t.type === 'buy' ? 1 : -1);
    t.pnl = diff * t.lot;

    if ((t.tp && price >= t.tp && t.type === 'buy') ||
        (t.tp && price <= t.tp && t.type === 'sell') ||
        (t.sl && price <= t.sl && t.type === 'buy') ||
        (t.sl && price >= t.sl && t.type === 'sell')) {
      balance += t.pnl;
      return false;
    }

    floating += t.pnl;

    tbody.innerHTML += `
      <tr>
        <td>${t.id}</td>
        <td>${t.type}</td>
        <td>${t.entry.toFixed(2)}</td>
        <td>${t.sl || '-'}</td>
        <td>${t.tp || '-'}</td>
        <td>${t.pnl.toFixed(2)}</td>
        <td><button onclick="closeTrade(${t.id})">X</button></td>
      </tr>
    `;
    return true;
  });

  document.getElementById('balance').textContent = balance.toFixed(2);
  document.getElementById('equity').textContent = (balance + floating).toFixed(2);
  document.getElementById('pnl').textContent = floating.toFixed(2);
}

function closeTrade(id) {
  const t = trades.find(x => x.id === id);
  balance += t.pnl;
  trades = trades.filter(x => x.id !== id);
}
