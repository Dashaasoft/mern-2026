import React, { useState } from "react";
import axios from "axios";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || phone.replace(/\D/g, "").length < 8) {
      alert("Утасны дугаар оруулна уу");
      return;
    }
    if (!agree) {
      alert("Эхлээд та үйлчилгээний нөхцөл зөвшөөрснөө чагтална уу");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone: "+976" + phone.replace(/\D/g, ""),
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold text-center">Мессежээр нэвтрэх</h2>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Таны утасны дугаар
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
              +976
            </span>
            <input
              type="tel"
              placeholder="86 12 34 56"
              value={phone}
              onChange={handlePhoneChange}
              maxLength="8"
              className="flex-1 px-4 py-2 outline-none"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <span className="text-xs text-gray-700">
              Би Unegui.mn сайтын үйлчилгээний нөхцөл, зар нийтлэх журмыг хүлээн
              зөвшөөрч, мөн өөрийгөө 18 нас хүрсэн болохыг баталж байна.
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Эхлээд та үйлчилгээний нөхцөл зөвшөөрснөө чагтална уу
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !agree}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Илгээж байна..." : "Мессежээр нэвтрэх"}
        </button>

        <button
          onClick={onClose}
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg transition"
        >
          Болих
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
