function SelectedTicketsList() {
    return (  
        <div className="p-2">
            <p className="text-(--text-primary)/70 text-[18px] mb-3">Chi tiết vé</p>

            <div className="flex flex-col gap-2 border-b border-(--text-primary)/50 pb-3">
                <div className="text-(--text-primary) flex items-center justify-between">
                    <p className="uppercase">ga - g12</p>
                    <p>1.200.000đ</p>
                </div>
                 <div className="text-(--text-primary) flex items-center justify-between">
                    <p className="uppercase">ga - g12</p>
                    <p>1.200.000đ</p>
                </div>
                 <div className="text-(--text-primary) flex items-center justify-between">
                    <p className="uppercase">ga - g12</p>
                    <p>1.200.000đ</p>
                </div>
            </div>

            <div className="text-(--text-primary) flex items-center justify-between border-b border-(--text-primary)/50 py-3">
                    <p className="uppercase">Phí dịch vụ</p>
                    <p>0đ</p>
            </div>

            <div className="text-(--text-primary) flex items-center justify-between py-3">
                    <p className="uppercase">Tổng cộng</p>
                    <p className="text-xl text-(--primary-color)">3.600.000đ</p>
            </div>

        </div>
    );
}

export default SelectedTicketsList;