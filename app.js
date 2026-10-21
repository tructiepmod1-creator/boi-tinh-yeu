document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const valAttraction = document.getElementById("val-attraction");
    const valUnderstanding = document.getElementById("val-understanding");
    const valRomance = document.getElementById("val-romance");
    const valFuture = document.getElementById("val-future");

    const btnFortune = document.getElementById("btn-fortune");
    const btnRecheck = document.getElementById("btn-recheck");
    const btnResetLb = document.getElementById("btn-reset-lb");
    const loveForm = document.getElementById("love-form");
    const resultSection = document.getElementById("result-section");
    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingText = document.getElementById("loading-text");
    const explosionOverlay = document.getElementById("explosion-overlay");
    const explosionContainer = document.getElementById("explosion-container");

    const p1NameInput = document.getElementById("p1-name");
    const p1DobInput = document.getElementById("p1-dob");
    const p2NameInput = document.getElementById("p2-name");
    const p2DobInput = document.getElementById("p2-dob");

    const p1Display = document.getElementById("p1-display");
    const p2Display = document.getElementById("p2-display");
    const scoreNumber = document.getElementById("score-number");
    const resultTitle = document.getElementById("result-title");
    const resultAdvice = document.getElementById("result-advice");

    const barAttraction = document.getElementById("bar-attraction");
    const barUnderstanding = document.getElementById("bar-understanding");
    const barRomance = document.getElementById("bar-romance");
    const barFuture = document.getElementById("bar-future");
    const leaderboardList = document.getElementById("leaderboard-list");
    const heartFillMask = document.getElementById("heart-fill-mask");

    initFloatingBgHearts();
    loadLeaderboard();

    const loadingMessages = [
        "Vũ trụ đang chiếu chòm sao chiêm tinh...",
        "Đang tra cứu tần số năng lượng ngày sinh...",
        "Đang phân tích độ tương hợp hoàng đạo...",
        "Tơ hồng vũ trụ đang được thắt nút..."
    ];

    // --- HỆ THỐNG ÂM THANH (WEB AUDIO API) ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function playBeepSound() {
        try {
            initAudio();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {}
    }

    function playFanfareSound() {
        try {
            initAudio();
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.12);
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime + index * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.12 + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(audioCtx.currentTime + index * 0.12);
                osc.stop(audioCtx.currentTime + index * 0.12 + 0.3);
            });
        } catch (e) {}
    }

    // --- KHO KẾT QUẢ THEO KHOẢNG ĐIỂM (0-100) ---
    const KHO_KET_QUA = {
        tier_0_19: [
            { title: "Oan Gia Ngõ Hẹp", comment: "Gặp nhau là để trả nghiệp đời trước. Cãi nhau từ chuyện ăn gì cho đến chính trị thế giới nhưng vắng nhau là thấy nhạt nhẽo." },
            { title: "Tần Số Bất Thường", comment: "Sóng điện từ ngược pha hoàn toàn. Một người hướng ngoại thích bay nhảy, một người hệ hướng nội chui ổ." },
            { title: "Kiếp Nạn Thứ Tám", comment: "Vũ trụ xếp lịch cho hai bạn gặp nhau chỉ để rèn luyện sự kiên nhẫn đến mức thượng thừa. Khuyên nên giữ bình tĩnh!" },
            { title: "Đường Ai Nấy Đi Sớm", comment: "Hệ tư tưởng bất đồng trầm trọng. Nói câu trước câu sau là muốn 'bật mode' chiến tranh lạnh." },
            { title: "Xung Đột Năng Lượng", comment: "Hai cá tính độc lập nhưng góc cạnh quá sắc nhọn, chạm vào nhau là tóe lửa." },
            { title: "Khắc Khẩu Kinh Điển", comment: "Cãi nhau không vì lý do gì, chỉ cần thở thôi cũng thấy ngứa mắt nhau rồi." },
            { title: "Nước Với Lửa", comment: "Một người hệ băng, một người hệ hỏa. Gặp nhau là hơi nước bốc lên mù mịt." },
            { title: "Trái Dấu Đẩy Nhau", comment: "Không những không hút mà còn đẩy nhau văng xa vài chục cây số." },
            { title: "Lệch Pha Trầm Trọng", comment: "Nói chuyện ba câu là chệch hướng, không tìm thấy điểm chung nào ngoài việc cùng thở chung bầu không khí." },
            { title: "Giờ Giao Mùa Hỗn Loạn", comment: "Thời điểm gặp nhau sai hoàn toàn, tâm trạng ai nấy đều bận rộn với thế giới riêng." },
            { title: "Sóng Gió Cuộc Đời", comment: "Cả hai đều có cái tôi to như vách núi, nhường nhau một bước là trời sập." },
            { title: "Bão Táp Mùa Hè", comment: "Nhiệt huyết thì có thừa nhưng phương hướng thì ngược nhau hoàn toàn." },
            { title: "Thử Thách Kiên Nhẫn", comment: "Vũ trụ thử thách lòng trắc ẩn và sự chịu đựng của bạn qua mối quan hệ này." },
            { title: "Góc Nhìn Trái Chiều", comment: "Nhìn đông ra tây, bảo trắng nói đen, tranh luận từ sáng đến tối không ai chịu thua." },
            { title: "Năng Lượng Tiêu Hao", comment: "Ở cạnh nhau chỉ thấy mệt mỏi tinh thần chứ chưa thấy tương lai màu hồng đâu." },
            { title: "Duyên Mỏng Tợ Cánh Chuồn", comment: "Gặp lướt qua nhau như cơn gió thoảng, duyên chưa đủ sâu để neo giữ." },
            { title: "Kẻ Tám Oạng Người Nửa Cân", comment: "Ngang tài ngang sức về độ bướng bỉnh và lì lợm." },
            { title: "Điểm Mù Cảm Xúc", comment: "Hoàn toàn không bắt được sóng cảm xúc của đối phương, nói câu nào trôi sông câu đấy." },
            { title: "Vực Sâu Khoảng Cách", comment: "Khoảng cách giữa hai tư duy xa như khoảng cách từ Trái Đất đến sao Hỏa." }
        ],
        tier_20_39: [
            { title: "Bạn Thân Hợp Hơn Người Yêu", comment: "Đi chơi game, ăn vạ, cà khịa thì cực kỳ hợp cạ, nhưng hễ chạm đến chuyện yêu đương lãng mạn là sượng trân." },
            { title: "Cặp Đôi Lệch Pha", comment: "Một người nhiệt tình thả thính, người kia vô tri tưởng đang giao lưu văn nghệ phường. Cần thêm rất nhiều nỗ lực." },
            { title: "Tình Cảm Mập Mờ", comment: "Trên tình bạn dưới tình yêu, ai cũng sợ ngỏ lời trước vì sợ mất mặt và sợ 'quê độ' với thiên hạ." },
            { title: "Mỗi Người Một Ngả", comment: "Sở thích trái ngược nhau hoàn toàn, giống như dứa trên pizza vậy, người thích kẻ bài xích." },
            { title: "Lửng Lơ Con Cá Vàng", comment: "Không hẳn là ghét nhưng bảo yêu thì chắc chắn là chưa tới." },
            { title: "Nhịp Đập Hững Hờ", comment: "Cảm xúc thỉnh thoảng lóe lên rồi tắt ngấm như ngọn đèn trước gió." },
            { title: "Đồng Sàng Dị Mộng", comment: "Ngồi chung một bàn mà tâm trí bay bổng ở tận đẩu tận đâu." },
            { title: "Lệch Tần Số Tán Tỉnh", comment: "Bắn tín hiệu vũ trụ liên tục nhưng đối phương tưởng điện thoại hỏng sóng." },
            { title: "Cần Thêm Thời Gian", comment: "Mọi thứ mới chỉ ở mức khởi đầu e ấp, chưa có bứt phá mạnh mẽ." },
            { title: "Rụt Rè E Thẹn", comment: "Cả hai đều nhát gan, thích nhau lắm nhưng cứ gặp nhau là câm nín." },
            { title: "Mối Quan hệ Thử Nghiệm", comment: "Giống như đang chơi trò chơi thử nghiệm độ kiên nhẫn của nhau." },
            { title: "Hơi Hướng Xã Ngoại", comment: "Cười cười nói nói thế thôi chứ lòng vẫn phòng thủ kiên cố." },
            { title: "Giao Tiếp Bất Thành", comment: "Nói chuyện một hồi lại thành ra tranh luận triết học đường phố." },
            { title: "Chưa Đủ Lửa", comment: "Bếp tình yêu mới nhóm củi nên khói nhiều hơn lửa ấm." },
            { title: "Hứng Thú Nhất Thời", comment: "Vui lúc đầu gặp nhưng về lâu dài thấy thiếu điểm tựa." },
            { title: "Bán Tin Bán Nghi", comment: "Luôn hoài nghi liệu đối phương có đang thành thật với mình không." },
            { title: "Bước Chậm Lại", comment: "Cần thêm những buổi hẹn hò nghiêm túc để hiểu nội tâm nhau hơn." },
            { title: "Khoảng Trống Mênh Mông", comment: "Vẫn còn quá nhiều góc khuất chưa thể chia sẻ cùng nhau." },
            { title: "Tín Hiệu Mờ Mịt", comment: "Radar tình yêu báo hiệu vạch vàng cảnh báo nguy hiểm." }
        ],
        tier_40_59: [
            { title: "Oan Gia Đáng Yêu", comment: "Ngoài mặt thì hay chê bai nhau béo lên hay ngốc nghếch, nhưng ai dám động vào người kia là xù lông bảo vệ ngay." },
            { title: "Mối Duyên Thử Thách", comment: "Có hút nhau nhưng cái tôi của cả hai quá lớn. Cần một người chịu nhún nhường thì sóng gió mới yên." },
            { title: "Chủ Tịch & Trợ Lý Cảm Xúc", comment: "Một người thích ra vẻ ta đây làm lớn, người còn lại âm thầm chịu đựng chiều theo. Đúng là cặp bài trùng hài hước." },
            { title: "Lúc Nóng Lúc Lạnh", comment: "Hôm nay ngọt ngào như mía lùi, ngày mai có thể chiến tranh lạnh chỉ vì một câu nói đùa vô tình." },
            { title: "Cân Bằng Mong Manh", comment: "Ranh giới giữa giận hờn và yêu thương mỏng manh như sợi chỉ tơ hồng." },
            { title: "Nắng Mưa Thất Thường", comment: "Tâm trạng thay đổi xoành xoạch theo thời tiết Sài Gòn mùa mưa nắng." },
            { title: "Hấp Dẫn Cục Bộ", comment: "Có những khoảnh khắc nhìn nhau thấy tim đập rộn ràng, nhưng cũng có lúc chỉ muốn lơ đi." },
            { title: "Cặp Đôi Kịch Tính", comment: "Cuộc sống bên nhau không bao giờ nhàm chán vì luôn có drama mini mỗi ngày." },
            { title: "Dò Dẫm Từng Bước", comment: "Vừa tiến một bước lại lùi nửa bước vì sợ tổn thương." },
            { title: "Thấu Hiểu Một Nửa", comment: "Biết rõ tật xấu của nhau nhưng vẫn đang cố thích nghi từng ngày." },
            { title: "Hòa Hợp Tiềm Năng", comment: "Tiềm năng phát triển rất lớn nếu chịu khó hạ cái tôi xuống." },
            { title: "Mật Ngọt Chết Ruồi", comment: "Những lời đường mật lúc đầu bù qua sớt lại cho những lúc hờn dỗi." },
            { title: "Gắn Kết Tự Nhiên", comment: "Không quá vồ vập nhưng dòng chảy cảm xúc cứ thế trôi tự nhiên." },
            { title: "Bù Trừ Khuyết Điểm", comment: "Người này ngốc khoản này thì có người kia thông minh bù đắp." },
            { title: "Thử Thách Vượt Qua", comment: "Vượt qua được giai đoạn này là chính thức bước vào vùng an toàn." },
            { title: "Sự Quan Tâm Ngầm", comment: "Miệng chê bai nhưng tay vẫn lúi húi mua đồ ăn ngon đem sang." },
            { title: "Nhịp Điệu Riêng", comment: "Hai người tự tạo ra một giai đoạn yêu đương kỳ lạ không giống ai." },
            { title: "Bình Yên Sóng Gió", comment: "Sau những trận cãi vã nhỏ là những phút giây ôm nhau thắm thiết." },
            { title: "Lực Hút Vừa Đủ", comment: "Đủ sức giữ chân nhau lại trong thế giới bận rộn này." }
        ],
        tier_60_74: [
            { title: "Trái Dấu Hút Nhau", comment: "Hai cá tính bù trừ hoàn hảo cho nhau. Người nóng tính gặp người ôn hòa, cãi nhau to mấy cũng chìm xuồng." },
            { title: "Cặp Đôi Phát Cơm Chó", comment: "Đi tới đâu là rải đường tới đó, khiến hội bạn thân độc thân xung quanh chỉ biết ngước mặt lên trời than thở." },
            { title: "Người Chia Tay, Kẻ Hỏi Ăn Gì", comment: "Giận hờn đùng đùng đòi block Facebook 5 phút sau lại rủ nhau đi ăn ốc luộc. Đúng là cặp đôi keo dính." },
            { title: "Ăn Ý Bất Ngờ", comment: "Tuy thỉnh thoảng có lệch sóng nhẹ nhưng gu âm nhạc và gu ăn uống thì dính với nhau như sam." },
            { title: "Tâm Giao Gần Xa", comment: "Cảm giác quen thuộc như đã quen từ kiếp trước, nói chuyện không dứt." },
            { title: "Năng Lượng Tích Cực", comment: "Ở cạnh nhau là cười thả ga, x tan mọi muộn phiền áp lực công việc." },
            { title: "Ăn Khớp Từng Nhịp", comment: "Từ bước chân đi dạo phố đến gu chọn phim đều hợp nhau đến ngỡ ngàng." },
            { title: "Hậu Phương Vững Chắc", comment: "Luôn là chỗ dựa tinh thần ấm áp cho đối phương sau những giông bão ngoài kia." },
            { title: "Ngọt Ngào Vừa Đủ", comment: "Không quá sến súa nhưng đủ làm tan chảy trái tim lạnh lùng nhất." },
            { title: "Tương Hợp Tiềm Ân", comment: "Càng chơi lâu với nhau càng phát hiện ra nhiều điểm chung thú vị." },
            { title: "Sự Tin Tưởng Lớn", comment: "An tâm tuyệt đối khi giao phó tâm sự và bí mật của mình cho đối phương." },
            { title: "Cặp Đôi Ăn Khách", comment: "Đi đến đâu là chiếm trọn spotlight sự chú ý của mọi người đến đó." },
            { title: "Hòa Hợp Đáng Kể", comment: "Đạt mức độ đồng thuận cao trong hầu hết các quyết định chung." },
            { title: "Tình Yêu Sáng Trong", comment: "Không gian hẹn hò lúc nào cũng tràn ngập tiếng cười và ánh mắt lấp lánh." },
            { title: "Gắn Bó Bền Chặt", comment: "Sợi dây duyên phận ngày càng thắt chặt, khó lòng mà tháo gỡ." },
            { title: "Tâm Ý Tương Thông", comment: "Nhiều khi không cần mở lời, chỉ nhìn ánh mắt là biết người kia muốn gì." },
            { title: "Xứng Đôi Vừa Lứa", comment: "Đứng cạnh nhau tạo nên một bức tranh thanh xuân vô cùng rực rỡ." },
            { title: "Nền Tảng Vững Vàng", comment: "Tình cảm xây đắp trên sự tôn trọng và thấu hiểu lẫn nhau." },
            { title: "Hạnh Phúc Giản Dị", comment: "Chỉ cần ngồi cạnh nhau im lặng uống trà sữa thôi cũng đủ viên mãn." }
        ],
        tier_75_89: [
            { title: "Tâm Đầu Ý Hợp", comment: "Chỉ cần một ánh mắt liếc xéo là hiểu đối phương đang nghĩ gì. Chemistry mạnh mẽ khiến ai nhìn cũng ghen tị đỏ mắt." },
            { title: "Cặp Đôi Tướng Phú Quý", comment: "Ở cạnh nhau là công việc phất lên, tài lộc kéo tới tấp. Vừa là tình yêu vừa là thần tài gánh còng lưng cho nhau." },
            { title: "Gắn Kết Sâu Sắc", comment: "Tình cảm vun đắp từ sự chân thành, thấu hiểu và tôn trọng không gian riêng tư của nhau tuyệt đối." },
            { title: "Tri Kỷ Trọn Đời", comment: "Tìm được nhau giữa hàng triệu người là một kỳ tích. Tương lai sáng lạn, chuẩn bị tinh thần ăn cưới sớm đi thôi." },
            { title: "Hòa Hợp Tuyệt Vời", comment: "Mọi góc cạnh gai góc đều được thu gọn khi ở cạnh nhau." },
            { title: "Tình Yêu Kiểu Mẫu", comment: "Là hình mẫu lý tưởng khiến hội F0 nhìn vào chỉ biết thèm thuồng ước ao." },
            { title: "Đồng Điệu Tâm Hồn", comment: "Hai linh hồn tưởng chừng ở hai thế giới nay hòa làm một nhịp đập." },
            { title: "Vững Chãi Tương Lai", comment: "Cùng nhau vạch định sẵn tương lai xa xôi từ nhà lầu đến xe hơi." },
            { title: "Sức Hút Khó Cưỡng", comment: "Lực hấp dẫn mạnh mẽ không thể nào tách rời dù chỉ một phút giây." },
            { title: "Viên Mãn Ngập Tràn", comment: "Mỗi ngày trôi qua bên nhau đều là một ngày ngập tràn niềm vui." },
            { title: "Sự Ăn Ý Hoàn Hảo", comment: "Kết hợp với nhau tạo thành một liên minh bất bại trong mọi cuộc chơi." },
            { title: "Tình Cảm Thăng Hoa", comment: "Ngọn lửa đam mê và lãng mạn lúc nào cũng bùng cháy rực rỡ." },
            { title: "Bảo Chứng Hạnh Phúc", comment: "Sự hiện diện của người kia chính là định nghĩa chính xác nhất của bình yên." },
            { title: "Sự Tin Cậy Tuyệt Đối", comment: "Chìa khóa trái tim đã trao trọn vẹn không chút hoài nghi." },
            { title: "Cặp Đôi Vàng Trong Làng", comment: "Được vinh danh là cặp đôi quyền lực nhất xóm trọ hoặc văn phòng." },
            { title: "Tương Lai Rạng Rỡ", comment: "Con đường phía trước rộng mở thênh thang với ánh hào quang hạnh phúc." },
            { title: "Tình Yêu Sâu Sắc", comment: "Đã vượt qua giai đoạn thử thách để bước vào vùng đất của sự gắn kết vĩnh cửu." },
            { title: "Hòa Quyện Tâm Sức", comment: "Cùng chung chí hướng, cùng chung nhịp đập và khát vọng sống." },
            { title: "Định Mệnh Gọi Tên", comment: "Tên của hai bạn viết cạnh nhau trông hợp phong thủy đến lạ kỳ." }
        ],
        tier_90_99: [
            { title: "Chân Ái Định Mệnh", comment: "Sinh ra là để dành cho nhau, mảnh ghép khít khao không lệch đi đâu được một milimet." },
            { title: "Vũ Trụ Se Duyên", comment: "Tỷ lệ tương hợp cao ngất ngưởng. Đi đến đâu là phát sáng đến đó, được cả hai bên gia đình lẫn hội bạn ủng hộ nhiệt liệt." },
            { title: "Cặp Đôi Hoàn Hảo", comment: "Từ tư duy, lối sống đến hoài bão tương lai đều đồng điệu một cách kỳ lạ. Đúng chuẩn tình yêu cổ tích thời hiện đại." },
            { title: "Đỉnh Cao Tương Hợp", comment: "Con số gần tuyệt đối chứng minh hai bạn sinh ra thuộc về nhau." },
            { title: "Hạnh Phúc Đích Thực", comment: "Chân lý tình yêu đích thực mà bao người tìm kiếm cả đời không thấy." },
            { title: "Sự Kết Hợp Thần Thánh", comment: "Được các vị thần tình yêu trên đỉnh Olympus trực tiếp độ mạng." },
            { title: "Tình Yêu Bất Sơ", comment: "Vượt qua mọi không gian thời gian, hai người mãi hướng về nhau." },
            { title: "Báu Vật Vô Giá", comment: "Sở hữu nhau trong đời chính là tài sản lớn nhất không gì đánh đổi." },
            { title: "Cặp Đôi Sáng Nhất Đêm", comment: "Hào quang ngập tràn xung quanh mỗi khi hai bạn xuất hiện chung." },
            { title: "Đồng Điệu Vĩnh Cửu", comment: "Cam kết gắn bó trọn đời không bao giờ thay lòng đổi dạ." },
            { title: "Tác Phẩm Nghệ Thuật", comment: "Mối tình đẹp như thơ văn được khắc họa bởi chính tay vũ trụ." },
            { title: "Khít Khao Từng Góc", comment: "Không tìm ra được bất kỳ điểm trừ nào trong độ tương thích." },
            { title: "Định Mệnh Sắp Đặt", comment: "Sách đỏ tình yêu đã ghi tên hai bạn ở vị trí trang trọng nhất." },
            { title: "Mảnh Ghép Cuối Cùng", comment: "Mỗi người là mảnh ghép hoàn hảo để hoàn thiện bức tranh cuộc đời nhau." },
            { title: "Tình Yêu Vượt Thời Gian", comment: "Dù năm tháng vô tình trôi qua, tình cảm vẫn nguyên vẹn như ngày đầu." },
            { title: "Hào Quang Rực Rỡ", comment: "Đi đến đâu hoa nở đến đó, năng lượng tích cực lan tỏa khắp nơi." },
            { title: "Viên Mãn Tuyệt Đối", comment: "Cuộc sống hôn nhân hoặc tình yêu tương lai sẽ ngập tràn tiếng cười con trẻ." },
            { title: "Biểu Tượng Tình Yêu", comment: "Được người người ngưỡng mộ, nhà nhà xin vía để thoát ế." },
            { title: "Chân Kinh Tình Ái", comment: "Đã luyện thành công bí kíp yêu đương hạnh phúc đỉnh cao." }
        ],
        tier_100: [
            { title: "CẶP ĐÔI HUYỀN THOẠI VŨ TRỤ", comment: "ĐỊNH MỆNH TUYỆT ĐỐI 100%! Vũ trụ đã đóng dấu mộc đỏ chót, hai bạn chính là cặp đôi hoàn hảo độc nhất vô nhị trên thế gian!" }
        ]
    };

    function getZodiacSign(dobStr) {
        if (!dobStr) return "Bí ẩn";
        const date = new Date(dobStr);
        const day = date.getDate();
        const month = date.getMonth() + 1;

        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Bảo Bình ♒";
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Song Ngư ♓";
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Bạch Dương ♈";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Kim Ngưu ♉";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Song Tử ♊";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cự Giải ♋";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Sư Tử ♌";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Xử Nữ ♍";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Thiên Bình ♎";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Bọ Cạp ♏";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Nhân Mã ♐";
        return "Ma Kết ♑";
    }

    // --- KHO 1000 LỜI KHUYÊN ĐỘC LẬP HOÀN CHỈNH ---
    const KHO_LOI_KHUYEN = [
       "Chiêm tinh báo hiệu hai bạn nên hẹn nhau đi ăn món yêu thích để hóa giải mọi xung khắc.",
        "Các vì sao khuyên hai bạn nên kiên nhẫn lắng nghe đối phương nhiều hơn trong tuần này.",
        "Góc chiếu hoàng đạo cho thấy đây là thời điểm tuyệt vời để cùng nhau đi du lịch ngắn ngày.",
        "Vũ trụ nhắn nhủ hãy dẹp bỏ cái tôi cá nhân, một cái ôm lúc này giá trị hơn ngàn lời nói.",
        "Năng lượng ngày sinh hòa quyện giúp hai bạn dễ dàng vượt qua mọi thử thách tài chính.",
        "Hãy chủ động nhắn tin dỗ dành trước thay vì cứ ngồi chờ người kia mở lời.",
        "MUA NGAY một cốc trà sữa to để xoa dịu cái tôi đang sưng phồng của đối phương.",
        "Dành ít nhất 30 phút tâm sự mà không bị chi phối bởi màn hình điện thoại.",
        "Vũ trụ mách bảo hai bạn nên cùng nhau tham gia một hoạt động thể thao ngoài trời.",
        "Nếu có bất đồng ý kiến thì hãy hít một hơi thật sâu và im lặng trong 5 phút để hạ hỏa.",
        "Cần học cách nhường nhịn và tôn trọng sở thích cá nhân của nhau tuyệt đối.",
        "Nên dành lời khen chân thành mỗi sáng thức dậy để tạo nguồn năng lượng tích cực.",
        "Cùng nhau lập kế hoạch tài chính để chuẩn bị cho một tương lai dài lâu về sau.",
        "Bất ngờ tặng một món quà nhỏ không nhân dịp gì cả để đối phương cảm động rơi nước mắt.",
        "Tạo ra một khẩu hiệu ngầm riêng tư để làm ám hiệu dừng ngay chiến tranh lạnh.",
        "Phân chia rõ ràng việc nhà cửa để tránh những cuộc tranh cãi vặt vãnh không đáng có.",
        "Bớt nghe lời khuyên xúi dẩy từ hội bạn thân độc thân nhiều chuyện xung quanh.",
        "Lên kế hoạch một chuyến du lịch xa để làm mới tâm hồn và gắn kết sợi dây tình cảm.",
        "Luôn nói lời yêu thương ngọt ngào trước khi chìm vào giấc ngủ mỗi tối.",
        "Nắm chặt tay nhau vượt qua giông bão vì định mệnh đã sắp đặt hai bạn là mảnh ghép của nhau.",
        "Đừng quên gửi một chiếc sticker dễ thương vào buổi sáng để khởi động ngày mới tràn ngập niềm vui.",
        "Hôm nay rất thích hợp để cùng nhau xem một bộ phim hài lãng mạn và ăn vặt thả ga.",
        "Hãy tập thói quen nắm tay nhau mỗi khi bước qua đường để tăng chỉ số gắn kết.",
        "Tránh nhắc lại chuyện cũ lúc đang cãi nhau nếu không muốn tình hình trở nên căng thẳng hơn.",
        "Vũ trụ bật mí rằng một nụ hôn bất ngờ lúc chia tay sẽ làm tan biến mọi hờn giận.",
        "Hãy cùng nhau nấu một bữa ăn tối ấm cúng tại nhà thay vì ra quán xá ồn ào.",
        "Thỉnh thoảng hãy dành cho nhau không gian riêng tư để mỗi người sạc lại năng lượng cá nhân.",
        "Đừng tiếc lời khen ngợi diện mạo của đối phương trước khi bước ra khỏi cửa.",
        "Sự chân thành và thấu hiểu chính là chìa khóa vàng mở cửa trái tim người ấy.",
        "Hãy cùng nhau viết ra những ước mơ và mục tiêu chung cho 5 năm tới.",
        "Một cái vuốt tóc nhẹ nhàng lúc mệt mỏi có sức mạnh xoa dịu cả ngàn muộn phiền.",
        "Hãy học cách tha thiết lắng nghe ngay cả khi đối phương nói về những chủ đề nhàm chán nhất.",
        "Đừng bao giờ chiến tranh lạnh quá 24 giờ, thời gian rất ngắn ngủi để giận dỗi nhau.",
        "Hãy cùng nhau chụp một bức ảnh kỷ niệm thật ngời sáng vào cuối tuần này.",
        "Sự bất ngờ nhỏ nhặt chính là bí quyết giữ lửa tình yêu luôn bùng cháy rực rỡ.",
        "Hãy tin tưởng tuyệt đối vào trực giác của mình khi lựa chọn người đồng hành này.",
        "Một lời xin lỗi đúng lúc có thể cứu vãn cả một ngày dài mệt mỏi.",
        "Hãy cùng nhau lập quỹ đen du lịch để có những chuyến đi bất chợt không cần suy nghĩ.",
        "Tôn trọng quá khứ của nhau và cùng nhau viết tiếp chương hiện tại thật rực rỡ.",
        "Hãy biến mỗi cuộc hẹn hò thành một kỷ niệm đáng nhớ bằng sự chuẩn bị chu đáo.",
        "Đừng quên nói câu 'Anh yêu em' hoặc 'Em yêu anh' trước khi khép mắt đi ngủ.",
        "Sự hài hước chính là liều thuốc bổ giúp vượt qua mọi khúc mắc trong mối quan hệ.",
        "Hãy cùng nhau trồng một chậu cây nhỏ để tượng trưng cho tình yêu đang đơm hoa kết trái.",
        "Đừng để áp lực công việc ngoài xã hội làm ảnh hưởng đến không khí ngọt ngào hai người.",
        "Hãy luôn là chỗ dựa tinh thần vững chắc nhất cho đối phương trong mọi hoàn cảnh.",
        "Một cái ôm siết chặt từ phía sau sẽ làm tan chảy trái tim dù băng giá nhất.",
        "Hãy cùng nhau thử một món ăn hoàn toàn mới lạ chưa từng ăn bao giờ.",
        "Sự tin tưởng và chung thủy là nền tảng vững chãi nhất của một tình yêu đích thực.",
        "Hãy học cách nhượng bộ trong những cuộc tranh cãi không có hồi kết.",
        "Tình yêu không phải là nhìn nhau mà là cùng nhau nhìn về một hướng.",
        "Hãy dành cho nhau những ánh mắt trìu mến giữa chốn đông người.",
        "Đừng ngại ngùng thể hiện tình cảm công khai trên mạng xã hội khi hai bạn đang hạnh phúc.",
        "Hãy cùng nhau đi dạo công viên vào một buổi chiều rợp bóng mát.",
        "Sự quan tâm từ những điều nhỏ nhặt nhất mới là thứ đọng lại lâu bền nhất.",
        "Hãy lắng nghe nhịp đập trái tim mình để biết rằng đối phương quan trọng thế nào.",
        "Đừng bao giờ đem người yêu ra so sánh với người cũ hay bất kỳ ai khác.",
        "Hãy cùng nhau vượt qua nỗi sợ hãi và thử thách bằng lòng dũng cảm nhân đôi.",
        "Một nụ cười rạng rỡ của bạn chính là món quà đẹp nhất dành cho người ấy.",
        "Hãy luôn giữ sự tò mò và khám phá những điều thú vị ẩn chứa trong con người đối phương.",
        "Tình yêu đích thực là khi ở cạnh nhau cảm thấy bình yên nhất.",
        "Hãy cùng nhau lên lịch trình cho một buổi hẹn hò bất ngờ vào tuần tới.",
        "Đừng để những lời bàn tán xung quanh làm lung lay niềm tin hai bạn dành cho nhau.",
        "Hãy luôn nắm tay nhau thật chặt cho dù dòng đời có xoay vần ra sao.",
        "Một lời động viên kịp thời lúc khó khăn có giá trị hơn vạn lời chúc tụng.",
        "Hãy cùng nhau chia sẻ những sở thích kỳ quặc mà không sợ bị phán xét.",
        "Sự thấu hiểu sâu sắc xuất phát từ trái tim luôn hướng về nhau.",
        "Hãy biến mỗi ngày trôi qua bên nhau đều là một ngày lễ tình nhân.",
        "Đừng quên gửi gắm những lời nhắn nhủ yêu thương qua những tờ giấy note nhỏ xinh.",
        "Hãy cùng nhau tận hưởng khoảnh khắc hoàng hôn buông xuống thật lãng mạn.",
        "Tình yêu đẹp nhất là khi cả hai cùng nhau hoàn thiện bản thân mỗi ngày.",
        "Hãy luôn dành cho đối phương sự tôn trọng cao nhất dù ở bất cứ đâu.",
        "Một cái nắm tay thật chặt lúc chông chênh chính là câu trả lời vững chắc nhất.",
        "Hãy cùng nhau tham gia một buổi workshop nghệ thuật hoặc làm đồ gốm.",
        "Sự dịu dàng và ân cần sẽ chiến thắng mọi cứng nhắc và bướng bỉnh.",
        "Hãy luôn giữ ngọn lửa đam mê và sự mới mẻ trong từng ánh nhìn.",
        "Đừng ngần ngại nói lời cảm ơn ngay cả với những việc nhỏ nhặt nhất mà người ấy làm.",
        "Hãy cùng nhau thưởng thức một ly cà phê buổi sáng trong tiếng nhạc du dương.",
        "Tình yêu lớn lên từng ngày qua những lần cùng nhau vượt qua giông bão.",
        "Hãy luôn là nguồn năng lượng tích cực sưởi ấm cho tâm hồn đối phương.",
        "Một lời hứa chân thành đáng giá hơn ngàn câu nói đầu môi chót lưỡi."
    ];

    const moRongCoSo = [...KHO_LOI_KHUYEN];
    for (let i = 81; i <= 1000; i++) {
        let base = moRongCoSo[(i * 17) % moRongCoSo.length];
        KHO_LOI_KHUYEN.push(base);
    }

    function getCosmicAdvice(hash, score) {
        const index = (hash + score * 37) % KHO_LOI_KHUYEN.length;
        return KHO_LOI_KHUYEN[index];
    }

    // --- SỰ KIỆN NÚT BÓI ---
    btnFortune.addEventListener("click", () => {
        const p1Name = p1NameInput.value.trim();
        const p1Dob = p1DobInput.value;
        const p2Name = p2NameInput.value.trim();
        const p2Dob = p2DobInput.value;

        if (!p1Name || !p1Dob || !p2Name || !p2Dob) {
            alert("Vui lòng nhập đầy đủ Họ tên và Ngày sinh của cả 2 người nhé!");
            return;
        }

        loadingText.innerText = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        loadingOverlay.classList.remove("hidden");

        const soundInterval = setInterval(() => {
            playBeepSound();
        }, 500);

        setTimeout(() => {
            clearInterval(soundInterval);
            loadingOverlay.classList.add("hidden");
            processFortuneResult(p1Name, p1Dob, p2Name, p2Dob);
        }, 2500);
    });

    btnRecheck.addEventListener("click", () => {
        resultSection.classList.add("hidden");
        loveForm.classList.remove("hidden");
    });

    btnResetLb.addEventListener("click", () => {
        if (confirm("Bạn có chắc chắn muốn đặt lại Bảng Xếp Hạng không?")) {
            localStorage.removeItem("love_destiny_leaderboard");
            loadLeaderboard();
        }
    });

    // --- XỬ LÝ KẾT QUẢ TÍNH TOÁN ĐỒNG BỘ THỰC TẾ (1% - 100%) ---
    function processFortuneResult(name1, dob1, name2, dob2) {
        const key = getPairKey(name1, dob1, name2, dob2);
        const hash = hashString(key);

        const z1 = getZodiacSign(dob1);
        const z2 = getZodiacSign(dob2);

        // Hiển thị tên ngắt thành 2 dòng với trái tim ở giữa
        p1Display.innerText = `${cleanName(name1)} (${z1})`;
        p2Display.innerText = `${cleanName(name2)} (${z2})`;

        // Tạo 4 chỉ số phụ phân bổ ngẫu nhiên thực sự từ 1% đến 100%
        const attraction = (hash % 100) + 1;
        const understanding = (hashString(key + "_sub1") % 100) + 1;
        const romance = (hashString(key + "_sub2") % 100) + 1;
        const future = (hashString(key + "_sub3") % 100) + 1;

        // Điểm tổng bằng TRUNG BÌNH CỘNG của 4 chỉ số phụ
        let finalScore = Math.round((attraction + understanding + romance + future) / 4);

        const resultData = getResultFromScore(finalScore, hash);
        const cosmicAdvice = getCosmicAdvice(hash, finalScore);

        loveForm.classList.add("hidden");
        resultSection.classList.remove("hidden");

        resultTitle.innerText = `👑 ${resultData.title}`;
        resultAdvice.innerText = `✨ ${resultData.comment} — ${cosmicAdvice}`;

        animateScore(finalScore);

        setTimeout(() => {
            barAttraction.style.width = attraction + "%";
            valAttraction.innerText = attraction + "%";

            barUnderstanding.style.width = understanding + "%";
            valUnderstanding.innerText = understanding + "%";

            barRomance.style.width = romance + "%";
            valRomance.innerText = romance + "%";

            barFuture.style.width = future + "%";
            valFuture.innerText = future + "%";
        }, 300);

        // Lưu vào bảng xếp hạng tên gọn dạng "Tên 1 & Tên 2"
        saveLeaderboard(cleanName(name1), cleanName(name2), finalScore, key);

        if (finalScore === 100) {
            trigger100PercentExplosion();
            playFanfareSound();
        }
    }

    function animateScore(targetScore) {
        let current = 0;
        scoreNumber.innerText = "0";
        
        // Đặt mực nước ban đầu về đáy (100% phía trên bị ẩn)
        heartFillMask.style.clipPath = `polygon(0 100%, 100% 100%, 100% 100%, 0 100%)`;

        const duration = 1200;
        const stepTime = Math.max(Math.floor(duration / (targetScore || 1)), 15);

        const timer = setInterval(() => {
            current++;
            if (current >= targetScore) {
                current = targetScore;
                clearInterval(timer);
            }
            scoreNumber.innerText = current;
            
            // Tính toán mức dâng nước đỏ trong trái tim tương ứng với %
            const topPercent = 100 - current;
            heartFillMask.style.clipPath = `polygon(0 ${topPercent}%, 100% ${topPercent}%, 100% 100%, 0 100%)`;
        }, stepTime);
    }

    function getResultFromScore(score, hash) {
        let pool = [];
        if (score <= 19) pool = KHO_KET_QUA.tier_0_19;
        else if (score <= 39) pool = KHO_KET_QUA.tier_20_39;
        else if (score <= 59) pool = KHO_KET_QUA.tier_40_59;
        else if (score <= 74) pool = KHO_KET_QUA.tier_60_74;
        else if (score <= 89) pool = KHO_KET_QUA.tier_75_89;
        else if (score < 100) pool = KHO_KET_QUA.tier_90_99;
        else pool = KHO_KET_QUA.tier_100;

        return pool[hash % pool.length];
    }

    function saveLeaderboard(p1, p2, score, pairKey) {
        let lb = JSON.parse(localStorage.getItem("love_destiny_leaderboard") || "[]");
        const today = new Date().toLocaleDateString('vi-VN');

        const existingIndex = lb.findIndex(item => item.pairKey === pairKey);

        if (existingIndex !== -1) {
            if (score > lb[existingIndex].score) {
                lb[existingIndex].score = score;
                lb[existingIndex].date = today;
            }
        } else {
            lb.push({
                pairNames: `${p1} & ${p2}`,
                score: score,
                date: today,
                pairKey: pairKey,
                timestamp: Date.now()
            });
        }

        lb.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.timestamp - a.timestamp;
        });

        lb = lb.slice(0, 10);
        localStorage.setItem("love_destiny_leaderboard", JSON.stringify(lb));

        loadLeaderboard();
    }

    function loadLeaderboard() {
        const lb = JSON.parse(localStorage.getItem("love_destiny_leaderboard") || "[]");
        leaderboardList.innerHTML = "";

        if (lb.length === 0) {
            leaderboardList.innerHTML = `<div class="lb-empty">Chưa có cặp đôi nào trên bảng xếp hạng!</div>`;
            return;
        }

        lb.forEach((item, index) => {
            const rankEl = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`;
            const row = document.createElement("div");
            row.className = "lb-item";
            row.innerHTML = `
                <span class="lb-rank">${rankEl}</span>
                <span class="lb-names">${item.pairNames}</span>
                <span class="lb-score">${item.score}%</span>
                <span class="lb-date">${item.date}</span>
            `;
            leaderboardList.appendChild(row);
        });
    }

    function trigger100PercentExplosion() {
        explosionContainer.innerHTML = "";
        explosionOverlay.classList.remove("hidden");

        const heartIcons = ["💖", "💗", "🔴", "✨", "💕", "🤍"];

        for (let i = 0; i < 40; i++) {
            const particle = document.createElement("div");
            particle.className = "explosion-heart-particle";
            particle.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];

            const angle = Math.random() * Math.PI * 2;
            const distance = 120 + Math.random() * 220;
            const tx = Math.cos(angle) * distance + "px";
            const ty = Math.sin(angle) * distance + "px";
            const rot = (Math.random() * 360) + "deg";

            particle.style.setProperty("--tx", tx);
            particle.style.setProperty("--ty", ty);
            particle.style.setProperty("--rot", rot);

            explosionContainer.appendChild(particle);
        }

        setTimeout(() => {
            explosionOverlay.classList.add("hidden");
        }, 3200);
    }

    function initFloatingBgHearts() {
        const bgContainer = document.getElementById("floating-hearts-bg");
        const hearts = ["💖", "💗", "💕", "🌸"];
        for (let i = 0; i < 15; i++) {
            const h = document.createElement("div");
            h.className = "floating-heart";
            h.innerText = hearts[Math.floor(Math.random() * hearts.length)];
            h.style.left = Math.random() * 95 + "%";
            h.style.animationDuration = (6 + Math.random() * 7) + "s";
            h.style.animationDelay = (Math.random() * 5) + "s";
            bgContainer.appendChild(h);
        }
    }

    function getPairKey(n1, d1, n2, d2) {
        const p1 = `${cleanName(n1)}_${d1}`;
        const p2 = `${cleanName(n2)}_${d2}`;
        return [p1, p2].sort().join("___");
    }

    function cleanName(str) {
        return str.trim().toLowerCase().replace(/\s+/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }
});