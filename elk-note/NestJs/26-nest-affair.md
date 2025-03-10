## 概述

### 定义
事务是数据库管理系统（DBMS）中一组逻辑操作单元，这些操作要么全部成功执行，要么全部失败回滚，确保数据从一种一致状态转换到另一种一致状态。

### 特性

* 原子性：事务中的操作不可分割，要么全部完成，要么全部不执行。
* 一致性：事务执行前后，数据库必须保持一致性状态（符合所有预定义规则）。
* 隔离性：并发事务之间相互隔离，防止数据不一致。
* 持久性：事务提交后，对数据的修改是永久性的，即使系统故障也不丢失。

### 隔离级别
| 隔离级别             | 脏读  | 不可重复读 | 幻读  | 描述                              | 
|------------------|-----|-------|-----|---------------------------------|
 | READ UNCOMMITTED | 是   | 是     | 是   | 最低隔离，允许读取未提交的数据变更               |
| READ COMMITTED      | 否   | 是     | 是   | 只能读取已提交的数据（多数数据库默认级别）           |
| REPEATABLE READ       | 否   | 否     | 是   | 同一事务多次读取结果一致，但可能有新插入数据（MySQL默认） |
|  SERIALIZABLE         | 否   | 否     | 否   | 最高隔离，事务串行执行，完全防止并发问题                                |

## 案例

以A给B转账为例： A给B转300， A扣300，B加300，这是两个操作，这两个操作就是要么都成功，要么都失败，一个成功
一个失败，那money就不知道去哪了，亏🐴了

```shell
nest g res transfer
```
### DTO文件
```typescript
export class CreateTransferDto {}

export class MoveTransferDto {
  fromId: number;
  toId: number;
  money: number;
}
```

### entities文件
````typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  money: number;
}
````

### Module文件
```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
@Module({
 imports: [TypeOrmModule.forFeature([Transfer])],
})
```

### Controller文件
```typescript
import { MoveTransferDto } from './dto/create-transfer.dto';

@Post('move')
move(@Body() moveTransferDto: MoveTransferDto) {
 return this.transferService.move(moveTransferDto);
}
```

### Service文件
```typescript
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from './entities/transfer.entity';

export class TransferService {
 constructor(
        @InjectRepository(Transfer) private readonly transferRepository: Repository<Transfer>
    ) {}

 async move(moveTransferDto: MoveTransferDto) {
  try {
   return await this.transferRepository.manager.transaction(
           async (manager) => {
            const fromInfo = await manager.findOne(Transfer, {
             where: {
              id: moveTransferDto.fromId,
             },
            });
            const toInfo = await manager.findOne(Transfer, {
             where: {
              id: moveTransferDto.toId,
             },
            });
            if (fromInfo.money < moveTransferDto.money) {
             return '余额不足';
            } else {
             fromInfo.money -= moveTransferDto.money;
             toInfo.money += moveTransferDto.money;
             await manager.save(fromInfo);
             await manager.save(toInfo);
             return  '转账成功'
            }
           },
   );
  } catch (error) {
   throw new Error(error);
  }
 }
}

```
