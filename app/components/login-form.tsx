< !DOCTYPE html >
    <html lang="th">

        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ประวัติอัตราการเต้นของหัวใจ</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                </head>

                <body class="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex flex-col items-center p-6">
                    <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-2xl flex flex-col">
                        <div class="flex justify-between items-center mb-4">
                            <h1 class="text-2xl md:text-3xl font-bold text-purple-800 flex items-center gap-2">
                                <svg class="text-pink-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                    </path>
                                </svg>
                                <span id="title">ประวัติอัตราการเต้นของหัวใจ</span>
                            </h1>
                            <span id="goalBadge" class="px-3 py-1 text-sm font-semibold text-white bg-purple-500 rounded-full hidden">เป้าหมาย: <span id="goalValue"></span> BPM</span>
                            <button onclick="clearHistory()" class="bg-red-800 text-white py-1.5 px-4 h-12 rounded-lg whitespace-nowrap">ล้างข้อมูล</button>
                        </div>

                        <div class="overflow-auto flex-grow">
                            <table class="w-full border-collapse border border-purple-200 mb-6">
                                <thead>
                                    <tr class="bg-purple-500 text-white">
                                        <th class="p-2 border border-purple-200">บันทึกเวลา</th>
                                        <th class="p-2 border border-purple-200">อัตราการเต้นของหัวใจ (BPM)</th>
                                        <th class="p-2 border border-purple-200">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody id="historyTable" class="text-center"></tbody>
                            </table>
                        </div>

                        <div class="flex-grow">
                            <canvas id="heartRateChart" class="w-full h-64"></canvas>
                        </div>

                        <a href="/index.html" class="block text-center text-purple-600 mt-4">ย้อนกลับไปหน้าแรก</a>
                    </div>

                    <script>
                        function loadGoal() {
                            let records = JSON.parse(localStorage.getItem("heartRateRecords")) || [];
            if (records.length > 0) {
                            let lastGoal = records[records.length - 1].heartRateGoal;
                        if (lastGoal) {
                            document.getElementById("goalBadge").classList.remove("hidden");
                        document.getElementById("goalValue").textContent = lastGoal;
                }
            }
        }

                        function clearHistory() {
                            Swal.fire({
                                title: 'คุณแน่ใจหรือไม่?',
                                text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'ยืนยัน',
                                cancelButtonText: 'ยกเลิก'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    localStorage.removeItem("heartRateRecords");
                                    location.reload();
                                    Swal.fire(
                                        'ล้างข้อมูลแล้ว!',
                                        'ข้อมูลของคุณถูกล้างแล้ว.',
                                        'success'
                                    )
                                }
                            })
                        }

                        window.onload = function() {
                            loadGoal();
        };
                    </script>
                </body>

            </html>
