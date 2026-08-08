export function WhatsAppButton() {
  const whatsappUrl =
    "https://wa.me/2349066853199?text=Hello%20Dune%20Consulting%2C%20I%20would%20like%20to%20make%20an%20enquiry%20about%20your%20HSE%20services.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Dune Consulting on WhatsApp"
      title="Chat with Dune Consulting on WhatsApp"
      className="group fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:outline-none sm:right-6 sm:bottom-6 sm:h-16 sm:w-16"
    >
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-md bg-[#0F2344] px-3 py-2 text-sm whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 sm:block">
        Chat with us on WhatsApp
      </span>

      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-7 w-7 sm:h-8 sm:w-8"
      >
        <path d="M12.04 2.004c-5.551 0-10.045 4.494-10.045 10.045 0 1.773.464 3.508 1.345 5.036L2 22l4.003-1.317a9.962 9.962 0 0 0 5.959 1.832c5.551 0 10.045-4.494 10.045-10.045S17.591 2.004 12.04 2.004Zm5.485 14.16c-.218.613-1.27 1.201-1.75 1.277-.474.075-1.048.108-2.232-.248-1.184-.357-2.188-1.148-3.1-2.184-1.397-1.558-2.287-3.535-2.474-4.28-.188-.745-.02-1.075.229-1.16.233-.082.484-.13.726-.13.242 0 .558.007.85.366.295.363 1.012 1.243 1.096 1.336.083.092.138.205.028.332-.11.127-.16.205-.313.317-.156.112-.324.249-.462.334-.14.086-.282.188-.12.37.163.183.721.938 1.548 1.534.855.623 1.574.806 1.821.899.243.088.382.074.522-.044.14-.117.602-.7.76-.944.156-.247.315-.202.528-.122.213.08 1.345.633 1.576.747.226.117.375.176.43.273.054.096.054.556-.163 1.169Zm0 0" />
      </svg>
    </a>
  );
}
