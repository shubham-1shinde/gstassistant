import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, ShieldCheck, ArrowRight, Mail } from "lucide-react";

function ThankYouRegister() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Mail size={22} className="text-blue-600" />,
      bg: "bg-blue-100",
      title: "Application Received",
      desc: "We've received your registration request successfully.",
    },
    {
      icon: <ShieldCheck size={22} className="text-orange-500" />,
      bg: "bg-orange-100",
      title: "Verification in Progress",
      desc: "Our team will verify your details and credentials.",
    },
    {
      icon: <CheckCircle size={22} className="text-green-600" />,
      bg: "bg-green-100",
      title: "Added to the List",
      desc: "Once verified, your account will be activated and listed.",
    },
  ];

  return (
  <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-4 md:p-0">

    <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden w-full md:w-[85vw] md:h-[60vh]">

      {/* LEFT — Banner */}
      <div className="bg-gradient-to-b from-blue-800 to-blue-600 w-full md:w-[300px] flex-shrink-0 flex flex-col items-center justify-center text-center px-6 md:px-10 py-8 md:py-0">

        <div className="bg-white/20 p-5 md:p-6 rounded-full mb-4 md:mb-6 active:scale-95 transition-transform">
          <CheckCircle size={48} className="text-white md:w-[52px] md:h-[52px]" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Thank You!
        </h1>

        <p className="text-blue-200 text-xs md:text-sm mt-3 leading-relaxed">
          Registration Submitted<br />Successfully
        </p>

      </div>

      {/* RIGHT — Content */}
      <div className="flex-1 bg-white flex flex-col justify-between px-6 md:px-12 py-6 md:py-10">

        {/* Top */}
        <div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
            We've received your application!
          </h2>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 md:mb-10">
            Thank you for registering as an accountant on{" "}
            <span className="font-semibold text-blue-600">GST Assistant</span>.
            Your application is under review. We will verify your details
            and add you to the accountant list shortly.
          </p>

          {/* Steps */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-0">

            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 md:gap-4 flex-1"
              >

                <div className="flex-1">

                  <div className={`${step.bg} p-3 rounded-full w-fit mb-2 md:mb-3 active:scale-95 transition-transform`}>
                    {step.icon}
                  </div>

                  <p className="text-sm md:text-base font-semibold text-gray-800">
                    {step.title}
                  </p>

                  <p className="text-xs md:text-sm text-gray-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>

                </div>

                {idx < steps.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="hidden md:block text-gray-300 mt-4 shrink-0"
                  />
                )}

              </div>
            ))}

          </div>

        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-5 mt-8 md:mt-10">

          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start active:scale-[0.99] transition-transform">

            <Clock size={20} className="text-amber-500 shrink-0 mt-0.5" />

            <p className="text-xs md:text-sm text-amber-700 leading-relaxed">
              Verification usually takes{" "}
              <span className="font-semibold">1–2 business days</span>.
              You'll receive a confirmation email once your account is activated.
            </p>

          </div>

        </div>

      </div>
    </div>
  </div>
);
}

export default ThankYouRegister;