
export const generatePortalGreeting = async (role: 'admin' | 'guest'): Promise<string> => {
  try {
    const response = await fetch("/api/greeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    return data.greeting;
  } catch (error) {
    console.error("Gagal mengambil ucapan selamat datang dari server:", error);
    return role === 'admin'
      ? "Sistem siap. Selamat bekerja di panel admin."
      : "Terima kasih telah berkunjung ke undangan kami.";
  }
};
