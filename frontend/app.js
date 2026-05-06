const API_URL = "https://your-backend-url.com"; // 替换为后端 API 地址

// 添加账号
document.getElementById("addAccountForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = document.getElementById("phone").value;
  const res = await fetch(`${API_URL}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  document.getElementById("phone").value = "";
  loadAccounts();
});

// 加载账号列表
async function loadAccounts() {
  const res = await fetch(`${API_URL}/accounts`);
  const accounts = await res.json();
  const tbody = document.querySelector("#accountTable tbody");
  tbody.innerHTML = "";
  accounts.forEach(acc => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${acc.id}</td>
      <td>${acc.phone_number}</td>
      <td>${acc.status}</td>
      <td>${acc.last_active || '-'}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteAccount(${acc.id})">删除</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
loadAccounts();

// 删除账号
async function deleteAccount(id) {
  await fetch(`${API_URL}/accounts/${id}`, { method: "DELETE" });
  loadAccounts();
}

// 批量保号
document.getElementById("keepAliveBtn").addEventListener("click", async () => {
  await fetch(`${API_URL}/keepalive`, { method: "POST" });
  alert("批量保号任务已触发，请查看日志！");
});
