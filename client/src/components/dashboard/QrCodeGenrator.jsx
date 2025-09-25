import {QRCodeCanvas} from 'qrcode.react';

const API_URL = import.meta.env.VITE_API_URL;

const QrCodeGenrator = ({adminId}) =>{
    console.log(`/upload/${adminId}`)
    return(
        <div>
    <QRCodeCanvas
        value={`${API_URL}/upload/${adminId}`}
        size={256}
        bgColor="#ffffff"
        fgColor="#111827"
        level="M"   
        includeMargin={true}
      />
      </div>
    )

}

export default QrCodeGenrator;