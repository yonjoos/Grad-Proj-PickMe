package PickMe.PickMeDemo.service;

import PickMe.PickMeDemo.dto.NotificationMessageDto;
import PickMe.PickMeDemo.repository.EmitterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    // 기본 타임아웃 설정
    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;

    private final EmitterRepository emitterRepository;

    /**
     * 클라이언트가 구독을 위해 호출하는 메서드.
     *
     * @param userId - 구독하는 클라이언트의 사용자 아이디.
     * @return SseEmitter - 서버에서 보낸 이벤트 Emitter
     */
    public SseEmitter subscribe(Long userId) {
        System.out.println("============start subscribe=========");
        SseEmitter emitter = createEmitter(userId);
        // toString()쓰면, 상대방의 SSE가 안켜졌을 때 NullPointerException 발생함!
        System.out.println("emitter = " + emitter);
        System.out.println("========end subscribe==========");

        NotificationMessageDto notificationMessageDto = new NotificationMessageDto("EventStream Created. [userId=" + userId + "]");

        sendToClient(userId, notificationMessageDto);
        return emitter;
    }

    /**
     * 서버의 이벤트를 클라이언트에게 보내는 메서드
     * 다른 서비스 로직에서 이 메서드를 사용해 데이터를 Object event에 넣고 전송하면 된다.
     *
     * @param userId - 메세지를 전송할 사용자의 아이디.
     * @param event  - 전송할 이벤트 객체.
     */
    public void notify(Long userId, Object event) {
        sendToClient(userId, event);
    }

    /**
     * 클라이언트에게 데이터를 전송
     *
     * @param id   - 데이터를 받을 사용자의 아이디.
     * @param data - 전송할 데이터.
     */
    private void sendToClient(Long id, Object data) {
        System.out.println("==========start send To Client============");
        System.out.println("=======start emitterRepository.get(id)============");
        SseEmitter emitter = emitterRepository.get(id);
        // toString()쓰면, 상대방의 SSE가 안켜졌을 때 NullPointerException 발생함!
        System.out.println("emitter = " + emitter);
        if (emitter != null) {
            try {
                System.out.println("==========================send emitter=================================");
                emitter.send(SseEmitter.event().id(String.valueOf(id)).name("sse").data(data));
                System.out.println("==========================send emitter=================================");
            } catch (IOException exception) {
                emitterRepository.deleteById(id);
                emitter.completeWithError(exception);
            }
        }
        System.out.println("=======end emitterRepository.get(id)============");
        System.out.println("==========end send To Client============");
    }

    /**
     * 사용자 아이디를 기반으로 이벤트 Emitter를 생성
     *
     * @param id - 사용자 아이디.
     * @return SseEmitter - 생성된 이벤트 Emitter.
     */
    private SseEmitter createEmitter(Long id) {
        System.out.println("========start create emmiter===========");
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitterRepository.save(id, emitter);

        // Emitter가 완료될 때(모든 데이터가 성공적으로 전송된 상태) Emitter를 삭제한다.
        emitter.onCompletion(() -> emitterRepository.deleteById(id));
        // Emitter가 타임아웃 되었을 때(지정된 시간동안 어떠한 이벤트도 전송되지 않았을 때) Emitter를 삭제한다.
        emitter.onTimeout(() -> emitterRepository.deleteById(id));

        System.out.println("========end create emmiter===========");

        return emitter;
    }
}