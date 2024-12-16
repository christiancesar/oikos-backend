import { Optional } from "@common/Optional";
import {
  IllegalDumpingEntity,
  StatusIllegalDumping,
} from "../entities/IllegalDumping";

export function makeIllegalDumping(
  illegal?: Optional<IllegalDumpingEntity>,
): IllegalDumpingEntity {
  return new IllegalDumpingEntity({
    description: illegal?.description ? illegal.description : "Denuncia Teste",
    status: illegal?.status ? illegal.status : StatusIllegalDumping.OPEN,
    attachments: illegal?.attachments ? illegal.attachments : [],
    latitude: illegal?.latitude ? illegal.latitude : 0,
    longitude: illegal?.longitude ? illegal.longitude : 0,
    solver: {},
    createdAt: new Date(),
  });
}
