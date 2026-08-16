export interface ForeignName {
  vietnamese: string;
  original: string;
  page: number;
  description: string;
}

export const FOREIGN_NAMES: ForeignName[] = [
  { vietnamese: 'A-mi-xi', original: 'Amicis', page: 64, description: 'Nhà văn nổi tiếng người Ý, tác giả cuốn sách "Những tấm lòng cao cả"' },
  { vietnamese: 'An-béc-tô Bốt-ti-ni', original: 'Anberto Bottini', page: 64, description: 'Nhân vật người bố trong truyện "Người thầy đầu tiên của bố tôi"' },
  { vietnamese: 'Ăng-co Vát', original: 'Angkor Wat', page: 126, description: 'Quần thể đền đài kiến trúc cổ kính tráng lệ tại Cam-pu-chia' },
  { vietnamese: 'Bò Kẹo', original: 'Bokeo', page: 129, description: 'Khu bảo tồn thiên nhiên nổi tiếng tại nước bạn Lào' },
  { vietnamese: 'Cam-pu-chia', original: 'Cambodia', page: 126, description: 'Quốc gia láng giềng Đông Nam Á' },
  { vietnamese: 'Cơ-rô-xét-ti', original: 'Corosetti', page: 63, description: 'Thầy giáo già tận tụy tám mươi tuổi trong bài đọc' },
  { vietnamese: 'Đa-nuýp', original: 'Danube', page: 131, description: 'Dòng sông thơ mộng chảy qua nhiều quốc gia châu Âu' },
  { vietnamese: 'Ép-phen', original: 'Eiffel', page: 123, description: 'Tháp sắt biểu tượng văn hóa của thủ đô Paris, nước Pháp' },
  { vietnamese: 'E-vơ-rét', original: 'Everest', page: 121, description: 'Đỉnh núi cao nhất hành tinh thuộc dãy Himalaya' },
  { vietnamese: 'Ê-dốp', original: 'Aesop', page: 77, description: 'Nhà viết truyện ngụ ngôn lừng danh thời Hy Lạp cổ đại' },
  { vietnamese: 'Grim', original: 'Grimm', page: 129, description: 'Hai anh em nhà văn sưu tầm truyện cổ tích nổi tiếng nước Đức' },
  { vietnamese: 'Ki-a', original: 'Kia', page: 109, description: 'Cô bé Việt kiều trong câu chuyện "Quê ngoại"' },
  { vietnamese: 'Lép Tôn-xtôi', original: 'Lev Tolstoy', page: 96, description: 'Đại văn hào vĩ đại người Nga' },
  { vietnamese: 'Luông Pha Bang', original: 'Luangprabang', page: 129, description: 'Cố đô cổ kính, yên bình của nước Lào' },
  { vietnamese: 'Lu-vơ-rơ', original: 'Louvre', page: 124, description: 'Bảo tàng nghệ thuật lớn nhất thế giới tại Paris' },
  { vietnamese: 'Ma-gien-lăng', original: 'Magellan', page: 140, description: 'Nhà hàng hải Bồ Đào Nha chỉ huy chuyến đi vòng quanh Trái Đất đầu tiên' },
  { vietnamese: 'Ma-ri-a', original: 'Maria', page: 22, description: 'Nhân vật cô bé thông minh trong bài đọc' },
  { vietnamese: 'Ma-tan', original: 'Mactan', page: 140, description: 'Hòn đảo thuộc quần đảo Phi-líp-pin' },
  { vietnamese: 'Mi-khai-in Pla-cốp-xki', original: 'Mikhail Plakovsky', page: 30, description: 'Nhà văn Nga viết truyện "Bài học quý"' },
  { vietnamese: 'Mi-lô', original: 'Milo', page: 116, description: 'Cậu bé đam mê nghệ thuật trong câu chuyện "Nghệ sĩ trống"' },
  { vietnamese: 'Mi-su', original: 'Michou', page: 123, description: 'Người bà thân thiện dẫn bé Dương đi thăm thủ đô Pa-ri' },
  { vietnamese: 'Nam Ngum', original: 'Nam Ngum', page: 129, description: 'Hồ thủy điện thơ mộng với vô số hòn đảo tại Lào' },
  { vietnamese: 'Ngô-rông-gô-rô', original: 'Ngorongoro', page: 113, description: 'Khu bảo tồn động vật hoang dã UNESCO tại Tan-da-ni-a' },
  { vietnamese: 'Oan Đi-xni', original: 'Walt Disney', page: 129, description: 'Nhà sản xuất phim hoạt hình huyền thoại của thế giới' },
  { vietnamese: 'Ô-xtrây-li-a', original: 'Australia', page: 126, description: 'Nước Úc với công trình Nhà hát Con Sò (Sydney Opera House)' },
  { vietnamese: 'Pa-ri', original: 'Paris', page: 123, description: 'Thủ đô nước Pháp, được mệnh danh là kinh đô ánh sáng' },
  { vietnamese: 'Phi-líp-pin', original: 'Philippines', page: 140, description: 'Quốc gia quần đảo ở Đông Nam Á' },
  { vietnamese: 'Tan-da-ni-a', original: 'Tanzania', page: 113, description: 'Quốc gia ở Đông Phi nổi tiếng với thiên nhiên hoang dã' },
  { vietnamese: 'Thô-ca-đê-rô', original: 'Trocadéro', page: 124, description: 'Quảng trường lớn đối diện tháp Eiffel ở Paris' },
  { vietnamese: 'Vang Viêng', original: 'Vang Vieng', page: 129, description: 'Thị trấn du lịch sinh thái nổi tiếng của nước Lào' },
  { vietnamese: 'Vích-to Huy-gô', original: 'Victor Hugo', page: 71, description: 'Đại văn hào người Pháp' },
  { vietnamese: 'Viêng Chăn', original: 'Vieng Chan', page: 129, description: 'Thủ đô của nước Cộng hòa Dân chủ Nhân dân Lào' },
  { vietnamese: 'Xê-vi-la', original: 'Sevilla', page: 140, description: 'Cảng biển lịch sử của Tây Ban Nha nơi hạm đội Magellan xuất phát' },
];

export const GRAMMAR_HANDBOOK = [
  {
    title: 'Câu và Hai thành phần chính',
    page: 10,
    summary: 'Câu là tập hợp từ diễn đạt một ý trọn vẹn, có trật tự hợp lí. Câu thường gồm Chủ ngữ và Vị ngữ.',
    points: [
      'Chủ ngữ (CN): Nêu người, vật, hiện tượng tự nhiên,... Trả lời cho: Ai? Cái gì? Con gì?',
      'Vị ngữ (VN): Nêu hoạt động, trạng thái, đặc điểm hoặc giới thiệu, nhận xét về đối tượng ở chủ ngữ. Trả lời cho: Làm gì? Thế nào? Là ai/là gì?',
    ],
  },
  {
    title: 'Trạng ngữ trong câu',
    page: 49,
    summary: 'Trạng ngữ là thành phần phụ của câu, bổ sung thông tin và thường đứng đầu câu, ngăn cách bằng dấu phẩy.',
    points: [
      'Trạng ngữ chỉ thời gian: Bổ sung thời gian (Khi nào? Bao giờ?) - Ví dụ: "Mùa xuân, trăm hoa đua nở."',
      'Trạng ngữ chỉ nơi chốn: Bổ sung địa điểm (Ở đâu? Chỗ nào?) - Ví dụ: "Ngoài vườn, chim hót líu lo."',
      'Trạng ngữ chỉ nguyên nhân: Bổ sung lý do (Vì sao? Nhờ đâu?) - Ví dụ: "Vì mưa to, đường ngập nước."',
      'Trạng ngữ chỉ mục đích: Bổ sung đích hướng tới (Để làm gì? Nhằm mục đích gì?) - Ví dụ: "Để học giỏi, em chăm chỉ đọc sách."',
      'Trạng ngữ chỉ phương tiện: Bổ sung phương tiện, công cụ (Bằng gì? Với cái gì?) - Ví dụ: "Bằng đôi cánh dẻo dai, chim bay khắp trời."',
    ],
  },
  {
    title: 'Các Dấu câu quan trọng',
    page: 90,
    summary: 'Công dụng và cách dùng dấu ngoặc kép, dấu ngoặc đơn, dấu gạch ngang trong tiếng Việt.',
    points: [
      'Dấu ngoặc kép (" "): Đánh dấu lời nói trực tiếp của nhân vật, phần trích dẫn nguyên văn, hoặc tên tác phẩm, bài báo, tài liệu.',
      'Dấu ngoặc đơn ( ( ) ): Đánh dấu phần chú thích, giải thích, thuyết minh bổ sung thông tin.',
      'Dấu gạch ngang (-): Đặt ở đầu dòng để đánh dấu các ý liệt kê hoặc đánh dấu lời đối thoại trực tiếp.',
    ],
  },
  {
    title: 'Quy tắc Viết hoa tên riêng & Cơ quan tổ chức',
    page: 107,
    summary: 'Cách viết hoa chuẩn mực theo Nghị định 30/2020/NĐ-CP.',
    points: [
      'Tên người và địa danh Việt Nam: Viết hoa chữ cái đầu của tất cả các âm tiết (Lê Hữu Trác, Hà Nội, Trường Sa).',
      'Tên cơ quan, tổ chức: Viết hoa chữ cái đầu của từng cụm từ chỉ loại hình, chức năng, cấp quản lý (Bộ Giáo dục và Đào tạo, Hội Bảo vệ Quyền trẻ em Việt Nam, Ban Công tác Thiếu nhi Trung ương Đoàn).',
      'Tên người, địa danh nước ngoài phiên âm có gạch nối: Chỉ viết hoa chữ cái đầu của mỗi bộ phận tạo thành tên (Ngô-rông-gô-rô, Pa-ri, Ma-gien-lăng).',
    ],
  },
  {
    title: 'Cẩm nang Tập làm văn Lớp 4',
    page: 84,
    summary: 'Phương pháp viết các thể loại văn bản trong học kì II.',
    points: [
      'Miêu tả cây cối: 3 phần (Mở bài trực tiếp/gián tiếp; Thân bài tả lần lượt từng bộ phận hoặc theo thời kì phát triển; Kết bài mở rộng/không mở rộng).',
      'Đoạn văn nêu tình cảm cảm xúc: 3 phần (Mở đầu, Triển khai, Kết thúc). Nêu kỉ niệm cụ thể và dùng từ ngữ bộc lộ cảm xúc chân thành.',
      'Viết Thư điện tử (Email): Có Chủ đề ngắn gọn, Lời chào, Nội dung thăm hỏi/chia sẻ, Tệp đính kèm (ảnh/video), Lời chúc và Kí tên.',
      'Giấy mời: Đầy đủ Tiêu đề, Người mời, Người được mời, Tên sự kiện, Thời gian, Địa điểm, Chữ kí.',
    ],
  },
];
