---
title: 用 WebSocket 替代 HTTP 轮询：装修平台实时消息推送实践
description: 在智能装修全流程管理平台中，基于 WebSocket 实现实时消息推送，替代传统 HTTP 轮询，将消息触达率提升至 100%。
publishedAt: 2026-07-20
tags:
  - WebSocket
  - Spring Boot
  - Android
draft: false
---

## 为什么放弃轮询

装修平台的消息场景（材料审核通知、施工节点变更、多方协作沟通）对实时性要求较高。最初的 HTTP 轮询方案存在明显短板：

- **延迟不可控**：轮询间隔内的消息无法及时触达；
- **资源浪费**：大量空轮询请求白白消耗服务端连接与带宽；
- **移动端耗电**：Android 端频繁唤醒网络模块，影响续航。

## 方案设计

采用 **Spring Boot WebSocket** 建立长连接，整体结构：

```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(messageHandler(), "/ws/message")
                .setAllowedOrigins("*");
    }
}
```

服务端维护用户 ID 到 WebSocket 会话的映射，业务事件发生时主动推送：

1. 用户连接时携带身份凭证，服务端鉴权后注册会话；
2. 业务层发布领域事件（如"审核通过"），消息监听器将其路由到目标用户的会话；
3. 推送失败时落库，用户下次上线时拉取离线消息，保证**触达率 100%**。

## 高并发下的数据一致性

审核类消息涉及多人并发操作同一条业务数据，这里引入了**数据库乐观锁**：

```java
@Entity
public class MaterialAudit {
    @Version
    private Long version;
    // ...
}
```

乐观锁让并发审核冲突在数据库层自然失败，配合明确的前端提示，最终实现**并发审核零冲突**。

## 经验总结

- WebSocket 适合"服务端主动触达"的场景，轮询适合低频、弱实时的场景，选型要看业务特征；
- 长连接方案必须配套离线消息兜底，否则触达率无从谈起；
- 实时推送与并发控制要一起设计——消息推得再快，数据错了就没有意义。
