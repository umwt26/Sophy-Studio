//! Diagnostic: download the Prompter AI model and run sample requests (CI only).
fn main() {
    let st = sophy_core::prompter_ai::status();
    println!("cpu_supported={} missing={:?} downloaded={}", st.cpu_supported, st.missing_cpu_features, st.model_downloaded);
    let rt = tokio::runtime::Runtime::new().unwrap();
    if !st.model_downloaded {
        let t = std::time::Instant::now();
        let last = std::cell::Cell::new(0u64);
        let r = rt.block_on(sophy_core::prompter_ai::download(|p| {
            let pct = p.total.map(|t| p.downloaded * 100 / t.max(1)).unwrap_or(0);
            if pct >= last.get() + 25 { last.set(pct); println!("download {}%", pct); }
        }));
        println!("download result={:?} in {:.1}s", r, t.elapsed().as_secs_f32());
    }
    let inputs = [
        "أريد أغنية راب حزينة مع بيانو وصوت نسائي",
        "Quero um funk brasileiro bem animado pra festa, com voz masculina",
        "karanlık bir drill parçası, erkek vokal, 142 bpm",
        "Hazme una cumbia triste con acordeón",
        "기타와 피아노가 있는 잔잔한 발라드, 여자 보컬",
        "Make the drums heavier and add a guitar solo",
        "Nakaratı daha enerjik yap, basları kıs",
        "Une chanson électro mélancolique pour la nuit",
        "Сделай медленный трек в стиле синтвейв без вокала",
        "雨の日に聴きたい切ないローファイ",
        "Ich will einen fröhlichen Schlager mit Akkordeon",
        "mujhe ek romantic hindi gaana chahiye flute ke saath",
    ];
    for i in inputs {
        let t = std::time::Instant::now();
        let r = sophy_core::prompter_ai::understand(i);
        println!("IN : {i}\nOUT: {:?}  ({:.2}s)", r, t.elapsed().as_secs_f32());
    }
}
