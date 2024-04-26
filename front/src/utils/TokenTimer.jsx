import React, { useState, useEffect } from 'react';
import {useAuth} from "../components/sidebar/contexts/auth";

function TokenTimer() {
    // 토큰 만료 시간 상태(state)
    const [expirationTime, setExpirationTime] = useState(null);
    const { signOut, tokenExtension } = useAuth();
    let tokenTime = localStorage.getItem("expirationTime");
;
    // 토큰 만료 시간 설정 및 타이머 시작
    useEffect(() => {
        // 토큰의 만료 시간을 가져와서 설정합니다.
        const tokenExpiration = new Date(localStorage.getItem("expirationTime"));
        setExpirationTime(tokenExpiration);

        // 만료 시간이 정상적으로 설정되었을 때 타이머 시작
        if (tokenExpiration) {
            // 1초마다 남은 시간을 업데이트하는 타이머
            const timer = setInterval(() => {
                const now = new Date();
                const remainingTime = tokenExpiration.getTime() - now.getTime();
                if (remainingTime <= 0) {
                    // 토큰이 만료되었을 때의 처리
                    clearInterval(timer);
                    window.alert("로그인이 만료되었습니다.")
                    signOut();
                } else if(remainingTime <= 600000 && remainingTime > 599000) {
                    if(window.confirm("로그인을 연장하시겠습니까?")){
                        tokenExtension();
                    }
                } else if(remainingTime <= 300000 && remainingTime > 299000) {
                    if(window.confirm("로그인을 연장하시겠습니까? 시간이 종료되면 자동 로그아웃 됩니다.")){
                        tokenExtension();
                    }
                }else{
                    // 남은 시간을 업데이트합니다.
                    setExpirationTime(new Date(tokenExpiration.getTime() - 1000));
                }
            }, 1000);
            // 컴포넌트가 언마운트될 때 타이머 정리
            return () => clearInterval(timer);
        }
    }, [tokenTime]);

    // 만료 시간을 시간:분:초 형태로 변환하는 함수
    const formatTime = (time) => {
        const totalSeconds = Math.floor(time / 1000);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds}`;
    };

    return (
        <div>
            {expirationTime ? (
                formatTime(expirationTime.getTime() - Date.now())
            ) : (
                <p>토큰 만료 시간을 가져오는 중...</p>
            )}
        </div>
    );
}

export default TokenTimer;