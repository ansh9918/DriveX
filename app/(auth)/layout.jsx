import Image from "next/image";

const layout = ({ children }) => {
    return (
        <div className="flex h-screen">
            <section className="bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5">
                <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12 ">
                    <h1 className="text-[40px] leading-[42px] font-bold text-white">
                        DriveX
                    </h1>
                    <div className="space-y-5 text-white">
                        <h1 className="h1">Your personal cloud, reimagined</h1>
                        <p className="body-1">
                            This is a place where you can store all your
                            documents.
                        </p>
                    </div>
                    <Image
                        src="/assets/images/files.png"
                        alt="Files"
                        width={320}
                        height={320}
                        className="transition-all hover:rotate-2 hover:scale-105"
                    />
                </div>
            </section>
            <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
                <div className="mb-16 lg:hidden">
                    <h1 className="text-[34px] leading-[42px] font-bold text-black">
                        DriveX
                    </h1>
                </div>
                {children}
            </section>
        </div>
    );
};

export default layout;
